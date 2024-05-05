import { useCallback, useState } from "react";
import "./App.css";
import { PathSelect } from "./PathSelect";
import { MasterControl } from "./MasterControl";
import { isMobile } from "react-device-detect";
import { ProgressLog } from "./ProgressLog";

function App() {
  const [masterFileList, setMasterFileList] = useState<File[]>([])
  const [progress, setProgress] = useState<string[]>([]);
  const pushProgress = useCallback((toSet:string) => setProgress((old) => old.concat(toSet)),[setProgress])
  return (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "lightgrey",
        alignItems: "center",
        minHeight: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "90%" : 1000,
          flexGrow: 1,
          backgroundColor: "white",
          marginLeft: isMobile ? 5 : undefined,
          marginRight: isMobile ? 5 : undefined,
          paddingLeft: 5,
          paddingRight: 5,
          height: "100%",
        }}
      >
        <div>
          <MasterControl masterFileList={masterFileList} pushProgress={pushProgress} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', flexGrow:1 }}>
          <div style={{ width: "50%", margin:10, padding:10, border:"solid black 5px" }}>
            <PathSelect updateMasterFileList={setMasterFileList} />
          </div>
          <div style={{ width: "50%", margin:10, padding:10, border:"solid black 5px" }}>
            <ProgressLog progress={progress}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
