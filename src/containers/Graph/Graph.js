import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
    addEdge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
} from 'react-flow-renderer';
import { ReactFlowProvider } from 'react-flow-renderer';
import { calculateNodeLocations, interpolateNodeLocations} from './utils/layoutHelpers.js';

import { initialNodes, initialEdges } from './utils/nodes-edges.js';
import './Graph.css';
import MiniMap from '../../components/MiniMap';

const layoutedNodes = calculateNodeLocations(
    initialNodes,
    initialEdges
);

const GraphBase = () => {
    const reactFlow = useReactFlow();
    const [nodes, setNodes] = useNodesState(layoutedNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    const onNodesChange = (changes) => setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds);
        return calculateNodeLocations(newNodes, edges);
    });

    const onEdgesChange = (changes) => {
        const newEdges = applyEdgeChanges(changes, edges);
        const newNodes = calculateNodeLocations(nodes, newEdges);

        setNodes(newNodes);
        setEdges(newEdges);
    }

    const onConnect = (params) => {
        reactFlow.addEdges(addEdge(params, edges));
    };

    useEffect(() => {
        if (!nodes.saddled) {
            setTimeout(() => {
                setNodes(interpolateNodeLocations(nodes, 0.05));
            }, 10)
        }
    });

    const addNodeButton = useCallback((params) => {
        setNodes((nds) => [...nds, {
            id: '12',
            data: { label: "selam caner" },
            position: { x: 1, y: 1 },
            targetPosition: 'top',
            sourcePosition: 'bottom'
        }]);
    }, [setNodes]);

    return (
        <div className="layoutflow">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                attributionPosition="top-right"
                nodesDraggable={false}
                fitView
            >
                <MiniMap />
                <Controls showInteractive={false} />
                <Background variant="lines" color="#f0f" gap={16} />
            </ReactFlow>
            <button onClick={addNodeButton}>Add</button>
        </div>
    );
};

const Graph = () => {
    return <ReactFlowProvider>
        <GraphBase />
    </ReactFlowProvider>
}

export default Graph;
