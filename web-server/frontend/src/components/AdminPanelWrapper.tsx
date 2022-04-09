import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, PageHeader } from 'antd';
import { Navigate } from 'react-router';
import { usePath } from 'hooks';
import { routes, RoutesEnum } from 'routes';

const { Header, Content, Footer, Sider } = Layout;

export function AdminPanelWrapper() {
  const [isMenuCollapsed, setCollapsedMenu] = useState(false);

  const { deepestPathPart, pathParts } = usePath();

  if (deepestPathPart === 'adminPanel') return <Navigate to="routesGraph" />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={isMenuCollapsed}
        onCollapse={setCollapsedMenu}
        width={300}
      >
        <Menu theme="dark" defaultSelectedKeys={pathParts} mode="inline">
          {Object.entries(routes).map(([route, { icon, menuTitle }]) => (
            <Menu.Item key={route} icon={icon}>
              <Link to={`/adminPanel/${route}`}>{menuTitle}</Link>
            </Menu.Item>
          ))}

          <Menu.Item key="empty"></Menu.Item>
          <Menu.Item key="logout">Logout</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <PageHeader
            title={routes[deepestPathPart as RoutesEnum]?.pageTitle}
            subTitle={routes[deepestPathPart as RoutesEnum]?.description}
          />
        </Header>
        <div style={{ margin: '16px', opacity: '0' }}></div>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Smarthouse made with ❤️ by 3rd team
        </Footer>
      </Layout>
    </Layout>
  );
}
