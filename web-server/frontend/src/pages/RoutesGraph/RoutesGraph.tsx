import React from 'react';
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styled from 'styled-components';

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

export class DemoCanvasWidget extends React.Component<DemoCanvasWidgetProps> {
  render() {
    return (
      <>
        <Container
          background={this.props.background || 'rgb(60, 60, 60)'}
          color={this.props.color || 'rgba(255,255,255, 0.05)'}
          style={{
            width: '500px',
            height: '500px',
          }}
        >
          {this.props.children}
        </Container>
      </>
    );
  }
}
export const RoutesGraph = () => {
  const engine = createEngine();

  const model = new DiagramModel();

  const node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)',
  });

  node1.setPosition(100, 100);

  const node3 = new DefaultNodeModel({
    name: 'Node 3',
    color: 'rgb(0,192,255)',
  });
  node1.setPosition(200, 100);

  const port1 = node1.addOutPort('Out');

  const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
  const port2 = node2.addInPort('In');
  node2.setPosition(400, 100);

  const link1 = port1.link<DefaultLinkModel>(port2);
  link1.getOptions().testName = 'Test';
  link1.addLabel('Hello World!');

  model.addAll(node1, node2, node3, link1);

  engine.setModel(model);

  return (
    <DemoCanvasWidget>
      <CanvasWidget engine={engine} />
    </DemoCanvasWidget>
  );
};
