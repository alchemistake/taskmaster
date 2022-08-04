import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import dagre from 'dagre';

import { initialNodes, initialEdges } from './nodes-edges.js';

import './index.css';

const nodeWidth = 172;
const nodeHeight = 36;
const connectionLine = ConnectionLineType.SimpleBezier;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'top';
    node.sourcePosition = 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }
  );

  const updateNodes = () => {
    setNodes((nds) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nds, edges);
      return [...layoutedNodes];
    })
  }

  useEffect(updateNodes, [nodes, edges]);

  const addNodeButton = useCallback((params) => {
    setNodes((nds) => [...nds, {
      id: '12',
      data: { label: "selam caner" },
      position: { x: 500, y: 86 },
      targetPosition: 'top',
      sourcePosition: 'bottom'
    }]);
  }, []);

  return (
    <div className="layoutflow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        attributionPosition="top-right"
        connectionLineType={connectionLine}
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

export default LayoutFlow;
