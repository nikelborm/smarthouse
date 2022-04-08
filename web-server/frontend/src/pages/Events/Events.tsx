import React from 'react';
import { Table, Space } from 'antd';
import { Tag, Divider } from 'antd';
const { Column, ColumnGroup } = Table;

const data = [
  {
    id:'1',
    uuid:'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
    name:'open door',
    description:'Test data for description',
    type:'command',
    obligatory:'open door',
    optional:'room',
  },
  {
    id:'2',
    uuid:'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
    name:'close door',
    description:'Test data for description',
    type:'log',
    obligatory:'close door',
    optional:'bathroom',
  },
  {
    id:'3',
    uuid:'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
    name:'check temperature',
    description:'Test data for description',
    type:'query',
    obligatory:'check temperature',
    optional:'livingroom',
  },
  {
    id:'4',
    uuid:'afab5164-2cd7-4d73-825e-fbec6a4cfbfd',
    name:'reset data',
    description:'Test data for description',
    type:'error',
    obligatory:'reset data',
    optional:'badroom',
  },
];

export const Events = () => {
  return (
    <Table dataSource={data}>
      <Column title="ID" dataIndex="id" key="id" />
      <Column title="UUID" dataIndex="uuid" key="uuid" />
      <Column  title="Name" dataIndex="name"  key="name"/>
      <Column title="Description" dataIndex="description" key="description" />
      <Column title="Type" dataIndex="type" key="type"
      render={tags => (
        <>
          {tag => {
            let color;
            if (tag === 'log'){
              color="lime";
            }
            if (tag === 'command'){
              color="cyan";
            }
            if (tag === 'query'){
              color="green";
            }
            if (tag === 'error'){
              color="red";
            }
            return(
              <Tag color={color}>
                {tag.toUpperCase()}
              </Tag>

          )
          }
        }
        </>
      )}
    />
      <ColumnGroup title="ParameterAssociations">
        <Column title="Obligatory" dataIndex="obligatory" key="obligatory"
        render={(_, {optional}) =>(
          <>
            {tags.map(tag => (
              <Tag color="blue" key={tag}>
                  {tag}
              </Tag>
            ))}
          </>
        )}
      />
        <Column title="Optional" dataIndex="optional" key="optional"
        render={(_, {optional}) => (
          <>
            {tags.map(tag => (
              <Tag color="green" key={tag}>
                {tag}
              </Tag>
            ))}
          </>
        )}
      />
      </ColumnGroup>
    </Table>
  );
};
