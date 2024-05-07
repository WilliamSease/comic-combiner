import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { useState } from 'react';

type IProps = {
    updateMasterFileList: (files: File[]) => void;
}

const rarErrMsg = "This tool does NOT yet support .cbr files (which are RAR files). I need to create a WASM binary for the c++ implementation of unrar. I'm working on it. For now this file is ignored. I reccomend using Calibre to convert your library to .cbz as workaround."

export const PathSelect = (props: IProps) => {
    const { updateMasterFileList } = props;
    const [selectedDirectory, setSelectedDirectory] = useState<FileList | null>(null);
    const fileList = useMemo(() => {
        if (!isNil(selectedDirectory)) {
            let out = [];
            for (let i = selectedDirectory.length; i >= 0; i--) {
                let file = selectedDirectory.item(i);
                if (!isNil(file)) {
                    out.push(file);
                }
            }
            updateMasterFileList(out.filter((file) => file.name.endsWith('.cbz') || file.name.endsWith('.cbr')))
            return out;
        }
    }, [selectedDirectory, updateMasterFileList])


    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (ref.current !== null) {
            ref.current.setAttribute("directory", "");
            ref.current.setAttribute("webkitdirectory", "");
        }
    }, [ref]);


    return (
        <>
            <input style={{ marginLeft: 5 }} type="file" ref={ref} onChange={(e) => {
                setSelectedDirectory(e.target.files)
            }} />

            <div style={{ flexGrow: 1, marginLeft: 5 }}>
                {fileList?.map((val) => {
                    if (val.name.endsWith(".cbz")) {
                        return (<div style={{ color: 'green', fontWeight: "bold" }}>{val.name}</div>)
                    }
                    if (val.name.endsWith(".cbr")) {
                        return (<>
                            <div style={{ color: 'red' }}>{val.name}</div>
                            <div style={{ color: 'red', fontWeight: "bold" }}>
                                {rarErrMsg}
                            </div>
                        </>)
                    }
                    return <div style={{ color: 'black' }}>{val.name}</div>
                })}
            </div>
        </>
    );
};