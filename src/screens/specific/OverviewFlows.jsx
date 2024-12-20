import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TextUpdaterNode from './TextUpdaterNode';
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import MainLayoutV2 from '../../layouts/MainLayoutV2';

import '@xyflow/react/dist/style.css';

// Node and edge dimensions for Dagre layout
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 80;
const nodeHeight = 80;

// Layout function to position nodes and edges automatically
const getLayoutedElements = (nodes, edges, color, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      type: 'textUpdater',
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      data: {
        label: node.data.label || 'Main Label',
        sublabel: node.data.sublabel || 'Sublabel',
        color: color,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const OverviewFlows = () => {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const structures = businessStructure?.structures;
  const paths = businessPreference?.paths;

  // Convert paths into nodes and edges
  useEffect(() => {
    if (!paths?.length) return;

    const newNodes = [
      {
        id: 'NODE',
        data: {
          label: businessPreference?.name || '-',
          sublabel: 'Structures',
        },
        position: { x: 0, y: 0 },
      },
    ];
    const newEdges = [];
    const addedNodes = new Set(['NODE']);

    const adjustedPaths = paths.map((path) => {
      //if it starts with users/connections, replace by contacts

      if (path.startsWith('users/connections')) {
        return path.replace('users/connections', 'contacts');
      }

      return path;
    });

    adjustedPaths.forEach((path) => {
      const parts = path.split('/');
      let parentId = 'NODE';

      parts.forEach((part, index) => {
        const nodeId = parts.slice(0, index + 1).join('/');

        const matchedStructures = structures?.filter((s) => s.id === part);

        const matchedNames = matchedStructures?.map((s) => s.name);
        const matchedId = matchedStructures?.map((s) => s.id);
        const matchedIds = matchedStructures?.map((s) => s.id?.slice(0, 6));

        const combinedNames =
          matchedNames?.length > 0 ? matchedNames.join(', ') : null;

        const combinedIds =
          matchedIds?.length > 0 ? matchedIds.join(', ') : null;

        if (!addedNodes.has(nodeId)) {
          newNodes.push({
            id: nodeId,
            data: {
              label: combinedNames || '-',
              sublabel: '#' + combinedIds || '-',
              structureId: matchedId,
            },
          });
          addedNodes.add(nodeId);
        }

        newEdges.push({
          id: `e-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: ConnectionLineType.SmoothStep,
          animated: true,
        });

        parentId = nodeId;
      });
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      businessPreference?.mainColor
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [paths]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(
          nodes,
          edges,
          businessPreference?.mainColor,
          direction
        );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  const nodeTypes = { textUpdater: TextUpdaterNode };

  return (
    <MainLayoutV2 pageTitle="Flows">
      <div style={{ height: '80vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ backgroundColor: '#F7F9FB' }}
        >
          <Panel position="top-right">
            <button onClick={() => onLayout('TB')}>Vertical</button>
            <button onClick={() => onLayout('LR')}>Horizontal</button>
          </Panel>
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </MainLayoutV2>
  );
};

export default OverviewFlows;
