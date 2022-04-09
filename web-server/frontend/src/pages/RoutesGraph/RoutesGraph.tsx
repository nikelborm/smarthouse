import React from 'react';
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel,
} from '@projectstorm/react-diagrams';

import { CanvasWidget } from '@projectstorm/react-canvas-core';

const engine = createEngine();

export const RoutesGraph = () => {
  const response = JSON.parse(
    `{
      "endpointUUID": "638bca8f-6f98-406a-bbad-0602bab08426",
      "messageUUID": "3f219b5b-f5b5-40e6-aac2-817c50c71b68",
      "parameters": [
        {
          "uuid": "67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff",
          "value": "[{\\"id\\":1,\\"sourceEndpointId\\":19,\\"sinkEndpointId\\":6,\\"createdAt\\":\\"2022-04-09T03:00:10.024Z\\",\\"updatedAt\\":\\"2022-04-09T03:00:10.024Z\\",\\"sourceEndpoint\\":{\\"uuid\\":\\"70da3236-e82a-4869-9b2d-51e2fc3cdc17\\",\\"clientId\\":3},\\"sinkEndpoint\\":{\\"uuid\\":\\"18ebc545-5c33-42da-b879-48adac946ef5\\",\\"clientId\\":2}},{\\"id\\":2,\\"sourceEndpointId\\":21,\\"sinkEndpointId\\":8,\\"createdAt\\":\\"2022-04-09T03:10:31.281Z\\",\\"updatedAt\\":\\"2022-04-09T03:10:31.281Z\\",\\"sourceEndpoint\\":{\\"uuid\\":\\"638bca8f-6f98-406a-bbad-0602bab08426\\",\\"clientId\\":3},\\"sinkEndpoint\\":{\\"uuid\\":\\"2def646b-e7e5-40e5-a94c-9253b942dce4\\",\\"clientId\\":2}}]"
        }
      ],
      "replyForMessageUUID": "97141be5-402c-4300-85c9-148bea3f7a4f"
    }
    `
  );
  console.log(
    'response.parameters[0].value: ',
    JSON.parse(response.parameters[0].value)
  );

  const node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)',
  });
  node1.setPosition(100, 100);
  const port1 = node1.addOutPort('Out');

  // node 2
  const node2 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)',
  });
  node2.setPosition(100, 100);
  const port2 = node2.addOutPort('Out');

  const link = port1.link<DefaultLinkModel>(port2);
  link.addLabel('Hello World!');

  const model = new DiagramModel();
  model.addAll(node1, node2, link);
  engine.setModel(model);
  return <CanvasWidget engine={engine} />;
};
