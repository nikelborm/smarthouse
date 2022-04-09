import React from 'react';
import { Table, Space } from 'antd';
import { Tag, Divider } from 'antd';
const { Column, ColumnGroup } = Table;

const data = {
  events: [
  {
    id:'1',
    uuid:'974ce0ad-5dbe-4685-9ae7-4ffd8285ce3e',
    shortname:'Andrew',
	fullname:'Andrew Klevtsov',
    description:'default user',
    isOnline: true,
  },
  {
    id:'2',
    uuid:'7fcc2537-424d-400c-9f10-aba0fe55c36c',
    shortname:'Dmitiry',
	fullname:'Dmitriy Gurevnin',
    description:'default user',
    isOnline: false,
  },
  {
    id:'3',
    uuid:'bda0e5c3-1bc9-4c9a-919f-0058c9e5d8c2',
    shortname:'Nikolay',
	fullname:'Nikolay Bormotov',
    description:'default user',
    isOnline: true,
  },
  {
    id:'4',
    uuid:'a2293aaf-1767-4e6e-ac56-04336f2d3302',
    shortname:'Nikita',
	fullname:'Nikita Davidchuk',
    description:'default user',
    isOnline: false,
  },
],
};

export const Clients = () => {
  return(
    <Table dataSource={data.events}>
      <Column title="ID" dataIndex="id" key="id" />
      <Column title="UUID" dataIndex="uuid" key="uuid" />
      <Column title="Short name" dataIndex="shortname"  key="shortname"/>
	  <Column title="Full name" dataIndex="fullname"  key="fullname"/>
      <Column title="Description" dataIndex="description" key="description" />


      <Column<Event>
        title="Online"
        dataIndex="isOnline"
        key="isOnline"
        render={(_, { isOnline }) => {
           <Tag color={isOnline ? 'green' : 'red'}> {isOnline ? 'online' : 'offline'}</Tag>;
          }
        }

          />
    </Table>
  );
};

interface Event {
  id: number;
  uuid: string;
  shortname: string;
  fullname: string;

  description: string;
    isOnline: boolean;
  };



interface GetEventTable {
  events: Event[];
}

