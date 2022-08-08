import dagre from 'dagre';

const NODE_WIDTH = 172;
const NODE_HEIGHT = 36;

const calculateNodeLocations = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', ranker: "hierarchy" });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = 'top';
        node.sourcePosition = 'bottom';

        node.desiredPosition = {
            x: nodeWithPosition.x,
            y: nodeWithPosition.y,
        };

        node.position = {
            x: node.position.x ? node.position.x : node.desiredPosition.x,
            y: node.position.y ? node.position.y : node.desiredPosition.y,
        }

        return node;
    });

    newNodes.saddled = newNodes.reduce(
        (previousValue, node) => {
            return  previousValue && node.desiredPosition.x === node.position.x && node.desiredPosition.y === node.position.y
        }, true
    )

    return newNodes;
};

const interpolateNodeLocations = (nodes, ratio) => {
    const newNodes = nodes.map((node) => {
        node.position = {
            x: node.position.x * ( 1 - ratio) + node.desiredPosition.x * (ratio),
            y: node.position.y * ( 1 - ratio) + node.desiredPosition.y * (ratio),
        }
        

        return node;
    });

    newNodes.saddled = newNodes.reduce(
        (previousValue, node) => {
            return previousValue && node.desiredPosition.x === node.position.x && node.desiredPosition.y === node.position.y
        }, true
    )

    return newNodes
}

export { calculateNodeLocations, interpolateNodeLocations}