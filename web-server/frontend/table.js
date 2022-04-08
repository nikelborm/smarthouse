import { Table, Tag, Space } from 'ant';

const columns = [
    {
      title:'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: tags => (
        <>
        {tags.map(tag => {
      let color = tag.length > 5 ? 'geekblue' : 'green';
      if (tag === 'admin') {
        color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
          </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>Rasie the rank</a>
          <a>Delet</a>
          </Space>
      )
    }
]

const data = [
  {
    key: '1',
    name: 'Gurevnin Dmitry',
    age: 19,
    tags: ['father'],
  },
  {
    key: '2',
    name: 'Nikolay Bormotov',
    age: 20,
    tags: ['admin'],
  },
  {
    key: '3',
    name: 'Andrew Klevtsov',
    age: 19,
    tags: ['mother'],
  },
  {
    key: '4',
    name: 'Nikita Davidchuk',
    age: 20,
    tags: ['son'],
    {
      key: '5',
      name: 'Ekaterina Burdugova',
      age: 19,
      tags: ['daughter'],
    },
  },
];

ReactDOM.render(<Table columns={columns} dataSource={data} />, mountNode);
