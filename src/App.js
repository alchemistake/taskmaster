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
import dagre from 'dagre';

import { initialNodes, initialEdges } from './nodes-edges.js';
import './index.css';

const NODE_WIDTH = 172;
const NODE_HEIGHT = 36;
const CONNECTION_LINE = ConnectionLineType.SimpleBezier;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

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

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - NODE_WIDTH / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };

    return node;
  });

  return newNodes;
};

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

  // useEffect(TBDANIMATIONS, [nodes, edges]);

  const addNodeButton = useCallback((params) => {
    setNodes((nds) => [...nds, {
      id: '12',
      data: { label: "selam caner" },
      position: { x: 500, y: 86 },
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
