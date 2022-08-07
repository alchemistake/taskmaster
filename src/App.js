import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from 'react-flow-renderer';
import { ReactFlowProvider } from 'react-flow-renderer';
import { getLayoutedElements, interpolate } from './layoutHelpers.js';

import { initialNodes, initialEdges } from './nodes-edges.js';
import './index.css';

const CONNECTION_LINE = ConnectionLineType.SimpleBezier;

const layoutedNodes = getLayoutedElements(
  initialNodes,
  initialEdges
);

const Taskmaster = () => {
  const reactFlow = useReactFlow();
  const [nodes, setNodes] = useNodesState(layoutedNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const onNodesChange = (changes) => setNodes((nds) => {
    const newNodes = applyNodeChanges(changes, nds);
    return getLayoutedElements(newNodes, edges);
  });

  const onEdgesChange = (changes) => {
    const newEdges = applyEdgeChanges(changes, edges);
    const newNodes = getLayoutedElements(nodes, newEdges);

    setNodes(newNodes);
    setEdges(newEdges);
  }

  const onConnect = (params) => {
    reactFlow.addEdges(addEdge(params, edges));
  };

  useEffect(() => {
    if(!nodes.saddled){
      setTimeout(() => {
        setNodes(interpolate(nodes, 0.1));
      }, 20)
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
        connectionLineType={CONNECTION_LINE}
        nodesDraggable={false}
        fitView
      >
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'output') return '#ff0072';

            return '#1a192b';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;

            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Controls showInteractive={false} />
        <Background variant="lines" color="#f0f" gap={16} />
      </ReactFlow>
      <button onClick={addNodeButton}>Add</button>
    </div>
  );
};

const TaskmasterWithProvider = () => {
  return <ReactFlowProvider>
    <Taskmaster />
  </ReactFlowProvider>
}

export default TaskmasterWithProvider;
