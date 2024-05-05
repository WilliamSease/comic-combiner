import JSZip from 'jszip';

type IProps = {
    masterFileList: File[];
    pushProgress: (toSet: string) => void;

}

export const MasterControl = (props: IProps) => {
    const { masterFileList, pushProgress } = props;

    return <div style={{ display: 'flex', flexDirection: 'row', margin:10, padding:10, border:"solid black 5px" }}>
        <button onClick={async () => {

            const extractedFilesArray: File[] = [];

            let masterIdx = 0;

            // CBZ -> IMG
            for (const archive of masterFileList) {
                if (archive.name.endsWith('.cbz')) {
                    pushProgress(`Unpack ${archive.name}...`)
                    let tzip = new JSZip();
                    let zipData = await tzip.loadAsync(archive)
                    const filenames = Object.keys(zipData.files).sort((a,b) => a.localeCompare(b));
                    for (const filename of filenames) {
                        const file = zipData.files[filename];
                        const fileContent = await file.async('blob');
                        extractedFilesArray.push(new File([fileContent], filename));

                    }
                    pushProgress(`Done!`)
                }
                else {
                    console.error("Not an archive")
                }

            }

            //IMG -> CBZ
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
        }}>Combine...</button>
    </div>
}