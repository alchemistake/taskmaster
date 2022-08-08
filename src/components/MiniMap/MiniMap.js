import { MiniMap as BaseMiniMap } from "react-flow-renderer";

const MiniMap = ({
    inputColor = "#0041d0",
    outputColor = "#ff0072",
    nodeColor = "#1a192b",
    nodeBorderRadius = 2,
    ...rest // TODO: Ts fix this to minimap thing.
}) => {
    return <BaseMiniMap
        nodeStrokeColor={(n) => {
            if (n.type === 'input') return inputColor;
            if (n.type === 'output') return outputColor;
            return nodeColor;
        }}
        nodeColor={(n) => {
            if (n.type === 'input') return inputColor;
            if (n.type === 'output') return outputColor;
            return nodeColor;
        }}
        nodeBorderRadius={nodeBorderRadius}
        {...rest}
    />
}

export default MiniMap;