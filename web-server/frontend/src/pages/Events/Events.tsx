import React from 'react';
import { Table, Space } from 'antd';
import { Tag, Divider } from 'antd';
const { Column, ColumnGroup } = Table;

const data = {
  events: [
    {
      id: '1',
      uuid: 'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
      name: 'open door',
      description: 'Test data for description',
      type: 'command',
      parameterAssociations: [
        {
          eventParameter: {
            id: 1981723,
            name: 'param1',
          },
          isParameterRequired: true,
        },
        {
          eventParameter: {
            id: 1981723,
            name: 'param2',
          },
          isParameterRequired: true,
        },
        {
          eventParameter: {
            id: 1981723,
            name: 'param2',
          },
          isParameterRequired: false,
        },
      ],
    },
    {
      id: '2',
      uuid: 'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
      name: 'close door',
      description: 'Test data for description',
      type: 'log',
      parameterAssociations: [
        {
          eventParameter: {
            id: 1981723,
            name: 'param3',
          },
          isParameterRequired: false,
        },
        {
          eventParameter: {
            id: 1981723,
            name: 'param4',
          },
          isParameterRequired: false,
        },
      ],
    },
    {
      id: '3',
      uuid: 'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
      name: 'check temperature',
      description: 'Test data for description',
      type: 'query',
      parameterAssociations: [
        {
          eventParameter: {
            id: 1981723,
            name: 'param5',
          },
          isParameterRequired: true,
        },
      ],
    },
    {
      id: '4',
      uuid: 'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
      name: 'reset data',
      description: 'Test data for description',
      type: 'error',
      parameterAssociations: [],
    },
  ],
};

export const Events = () => {
  return (
    <Table dataSource={data.events}>
      <Column title="ID" dataIndex="id" key="id" />
      <Column title="UUID" dataIndex="uuid" key="uuid" />
      <Column title="Name" dataIndex="name" key="name" />
      <Column title="Description" dataIndex="description" key="description" />
      <Column
        title="Type"
        dataIndex="type"
        key="type"
        render={(tag) => {
          let color;
          if (tag === 'log') {
            color = 'lime';
          }
          if (tag === 'command') {
            color = 'cyan';
          }
          if (tag === 'query') {
            color = 'green';
          }
          if (tag === 'error') {
            color = 'red';
          }
          return <Tag color={color}>{tag.toUpperCase()}</Tag>;
        }}
      />
      <ColumnGroup title="ParameterAssociations">
        <Column<Event>
          title="Obligatory"
          dataIndex="obligatory"
          key="obligatory"
          render={(_, { parameterAssociations }) =>
            parameterAssociations
              .filter(({ isParameterRequired }) => isParameterRequired)
              .map(({ eventParameter: { name, id } }) => (
                <Tag color="blue" key={id}>
                  {name}
                </Tag>
              ))
          }
        />
        <Column<Event>
          title="Optional"
          dataIndex="optional"
          key="optional"
          render={(_, { parameterAssociations }) =>
            parameterAssociations
              .filter(({ isParameterRequired }) => !isParameterRequired)
              .map(({ eventParameter: { name, id } }) => (
                <Tag color="blue" key={id}>
                  {name}
                </Tag>
              ))
          }
        />
      </ColumnGroup>
    </Table>
  );
};

interface Event {
  id: number;
  uuid: string;
  name: string;

  description: string;
  type: 'command' | 'log' | 'query' | 'error';
  parameterAssociations: {
    eventParameter: {
      id: number;
      name: string;
    };
    isParameterRequired: boolean;
  }[];
  hexColor: string;
}

interface GetEventTable {
  events: Event[];
}
