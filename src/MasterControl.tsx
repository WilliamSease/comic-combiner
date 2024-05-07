import JSZip from 'jszip';
import { createExtractorFromData } from 'node-unrar-js';

type IProps = {
    masterFileList: File[];
    pushProgress: (toSet: string) => void;

}

export const MasterControl = (props: IProps) => {
    const { masterFileList, pushProgress } = props;

    return <div style={{ display: 'flex', flexDirection: 'row', margin: 10, padding: 10, border: "solid black 5px" }}>
        <button onClick={async () => {

            const extractedFilesArray: File[] = [];
            const wasmBinary = await (
                await fetch('./unrar.wasm', { credentials: 'same-origin' })
            ).arrayBuffer();

            let masterIdx = 0;

            // CBZ -> IMG
            for (const archive of masterFileList) {
                if (archive.name.endsWith('.cbz')) {
                    pushProgress(`Unpack ${archive.name}...`)
                    let tzip = new JSZip();
                    let zipData = await tzip.loadAsync(archive)
                    const filenames = Object.keys(zipData.files).sort((a, b) => a.localeCompare(b));
                    for (const filename of filenames) {
                        const file = zipData.files[filename];
                        const fileContent = await file.async('blob');
                        extractedFilesArray.push(new File([fileContent], filename));

                    }
                    pushProgress(`Done!`)
                } else if (archive.name.endsWith('.cbr') || archive.name.endsWith('.rar')) {
                    pushProgress(`UnRAR ${archive.name}...`)
                    try {
                    let extractor = await createExtractorFromData({ wasmBinary: wasmBinary, data:await archive.arrayBuffer()});
                    const { fileHeaders } = extractor.getFileList();
                    let tempFiles: File[] = [];
                    for (const fileHeader of fileHeaders) {
                        console.info(fileHeader)
                        let content = extractor.extract({files:[fileHeader.name]})
                        for (const file of content.files) {
                            tempFiles.push(new File([new Blob([file.extraction ?? ""])], fileHeader.name))
                        }
                    }
                    extractedFilesArray.push(...tempFiles.sort((a,b) => a.name.localeCompare(b.name)))
                } catch (err) {
                    console.error(err)
                    pushProgress("ERROR!:")
                    pushProgress(JSON.stringify(err))
                }
                }
                else {
                    console.error("Not an archive")
                }

            }

            //IMG -> CBZ
            if (extractedFilesArray.length === 0) {
                pushProgress("FAILURE: No valid files extracted!!!");
            } else {
                let zip = new JSZip();
                pushProgress(`Write back to output...`)
                extractedFilesArray.forEach((imageFile) => {
                    const filename = `${masterIdx}_${imageFile.name}.jpg`; // Adjust filename as needed
                    masterIdx += 1;
                    zip.file(filename, imageFile);
                });
                pushProgress(`Done!`)
                const zipData = await zip.generateAsync({ type: 'blob' });
                const cbzBlob = new Blob([zipData], { type: 'application/vnd.comicbook+zip' });



                const url = URL.createObjectURL(cbzBlob);

                // Create a link element
                const link = document.createElement('a');
                link.href = url;
                link.download = 'output.cbz';

                // Append the link to the body
                document.body.appendChild(link);

                // Click the link to trigger download
                link.click();

                // Clean up
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }
        }}>Combine...</button>
    </div>
}