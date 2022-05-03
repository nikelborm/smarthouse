import React from 'react';
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styled from 'styled-components';
import { parse } from 'csv-parse/browser/esm/sync';
import { remapToIndexedObject } from 'utils/remapToIndexedObject';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function findDirectedCycle<T>(
  startNodes: Iterable<T>,
  getConnectedNodes: (node: T) => Iterable<T>
) {
  function connected(node) {
    const thing = getConnectedNodes(node);
    if (thing == null) return [][Symbol.iterator]();
    if (thing[Symbol.iterator]) return thing[Symbol.iterator]();
    return thing;
  }

  const visited = new Set();

  const nodeStack: T[] = [];
  const connectedNodeStack: (Iterable<T> | Iterator<T>)[] = [];
  const nodeIndexes = new Map();

  for (const startNode of startNodes) {
    if (visited.has(startNode)) continue;
    visited.add(startNode);
    nodeIndexes.set(startNode, nodeStack.length);
    nodeStack.push(startNode);
    connectedNodeStack.push(connected(startNode));

    while (nodeStack.length) {
      const connectedNodes = connectedNodeStack[
        connectedNodeStack.length - 1
      ] as any;
      const next = connectedNodes.next();
      if (next.done) {
        connectedNodeStack.pop();
        const removedNode = nodeStack.pop();
        nodeIndexes.delete(removedNode);
        continue;
      }
      const nextNode = next.value;
      const cycleStartIndex = nodeIndexes.get(nextNode);
      if (cycleStartIndex != null) {
        // found a cycle!
        return nodeStack.slice(cycleStartIndex);
      }
      if (visited.has(nextNode)) continue;
      visited.add(nextNode);
      nodeIndexes.set(nextNode, nodeStack.length);
      nodeStack.push(nextNode);
      connectedNodeStack.push(connected(nextNode));
    }
  }

  return null;
}

export const Toolbar = styled.div`
  padding: 5px;
  display: flex;
  flex-shrink: 0;
`;

export const Content = styled.div`
  flex-grow: 1;
  height: 100%;
`;
export interface DemoWorkspaceWidgetProps {
  buttons?: any;
}
export const AContainer = styled.div`
  background: black;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
`;

export const DemoButton = styled.button`
  background: rgb(60, 60, 60);
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  color: white;
  outline: none;
  cursor: pointer;
  margin: 2px;
  border-radius: 3px;

  &:hover {
    background: rgb(0, 192, 255);
  }
`;

export interface DemoCanvasWidgetProps {
  color?: string;
  background?: string;
}

export const Container = styled.div<{ color: string; background: string }>`
  height: 100%;
  background-color: ${(p) => p.background};
  background-size: 50px 50px;
  display: flex;

  > * {
    height: 100%;
    min-height: 100%;
    width: 100%;
  }

  background-image: linear-gradient(
      0deg,
      transparent 24%,
      ${(p) => p.color} 25%,
      ${(p) => p.color} 26%,
      transparent 27%,
      transparent 74%,
      ${(p) => p.color} 75%,
      ${(p) => p.color} 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      ${(p) => p.color} 25%,
      ${(p) => p.color} 26%,
      transparent 27%,
      transparent 74%,
      ${(p) => p.color} 75%,
      ${(p) => p.color} 76%,
      transparent 77%,
      transparent
    );
`;

function buildElectiveNode(name: string) {
  const node = new DefaultNodeModel({
    name: name,
    color: `hsl(${getRandomInt(360)}, 100%, 69%)`,
  });
  const outPort = node.addOutPort('Out');
  const inPort = node.addInPort('In');
  return {
    name,
    node,
    outPort,
    inPort,
  };
}

export const RoutesGraph = () => {
  const engine = createEngine();

  const model = new DiagramModel();
  const input = `
Фамилия Имя,Текущий электив,Желаемый электив
Бормотов Николай,Схематичный рисунок,Информация: новый подход
Джамиев Касум,Статистика,Схематичный рисунок
Шейко Ксения ,Тестирование ПО,Поиск и устранение неисправностей
Абакарова Кистаман,Статистика,Тестирование ПО
Абакарова Кистаман,Статистика,Информация: новый подход
Манацкая Кристина,"""Мега"" миля",Тестирование ПО
Коленкин Алексей,Статистика,"""Мега"" миля"
Коленкин Алексей,Статистика,Схематичный рисунок
Коленкин Алексей,Статистика,Поиск и устранение неисправностей
Коваленко Злата ,"""Мега"" миля","Ток, код и роботы"
Шевчук Роман,"""Мега"" миля","Ток, код и роботы"
Антонян Артём,"Ток, код и роботы",Тестирование ПО
Дрожжин Дмитрий,Информация: новый подход,Тестирование ПО
Февралев Дмитрий,"Ток, код и роботы",Поиск и устранение неисправностей
`;

  const content = parse(input, {
    skip_empty_lines: true,
  }) as [string, string, string][];

  const connections = content.slice(1).map(([personName, source, sink]) => ({
    personName,
    source,
    sink,
  }));

  const electivesNodeNames = [
    ...new Set([
      ...connections.map(({ source }) => source),
      ...connections.map(({ sink }) => sink),
    ]),
  ];

  const electivesNodes = electivesNodeNames.map(buildElectiveNode);

  model.addAll(...electivesNodes.map(({ node }) => node));

  const indexedElectiveNodes = remapToIndexedObject(
    electivesNodes,
    ({ name }) => name
  );

  const links = connections.map(({ personName, sink, source }) => {
    const link = indexedElectiveNodes[source].outPort.link<DefaultLinkModel>(
      indexedElectiveNodes[sink].inPort
    );
    link.getOptions().testName = [personName, sink, source].join();
    link.addLabel(personName);
    return link;
  });

  model.addAll(...links);
  engine.setModel(model);

  function getSourcesOfNode(sinkName: string): string[] {
    return connections
      .filter(({ sink }) => sink === sinkName)
      .map(({ source }) => source);
  }

  function getAllPossibleInputNodes(sinkName: string): string[] {
    const sourcesOfNode = getSourcesOfNode(sinkName);

    const secondarySourcesOfNode = sourcesOfNode.flatMap((sourceOfNode) =>
      getAllPossibleInputNodes(sourceOfNode)
    );

    return [...new Set([...sourcesOfNode, ...secondarySourcesOfNode])];
  }

  const missingLinks = electivesNodeNames.flatMap((sink) =>
    getAllPossibleInputNodes(sink).map((source) => ({
      source: sink,
      sink: source,
    }))
  );

  const maxlength = Math.max(
    ...missingLinks.map(({ source }) => source.length)
  );

  const missingLinksBeatified = missingLinks
    .map(
      ({ sink, source }) =>
        `Текущий электив: ${source},${' '.repeat(
          maxlength - source.length
        )} Желаемый электив: ${sink}`
    )
    .join('\n');
  console.log(missingLinksBeatified);

  const edges: { [sourceElectiveName: string]: string[] } = {};

  for (const connection of connections) {
    if (connection.source in edges) {
      edges[connection.source].push(connection.sink);
    } else {
      edges[connection.source] = [connection.sink];
    }
  }
  console.log('edges: ', edges);
  const startNodes = ['Статистика'];
  const getConnectedNodes = (node: string | number) => edges[node];

  console.log(
    'findDirectedCycle(startNodes, getConnectedNodes): ',
    findDirectedCycle(startNodes, getConnectedNodes)
  );

  return (
    <Container
      background="rgb(60, 60, 60)"
      color="rgba(255,255,255, 0.05)"
      style={{
        width: '100%',
        height: '45vw',
      }}
    >
      <CanvasWidget engine={engine} />
    </Container>
  );
};
