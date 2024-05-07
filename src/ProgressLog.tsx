
type IProps = {
    progress:string[];
}

export const ProgressLog = (props:IProps) => {
    const {progress} = props;

    return <>{progress.map((prog, i) => 
        <div key={i}>{prog}</div>
    )}</>
}