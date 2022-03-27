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
  if (deepestPathPart === 'adminPanel') return <Navigate to="profile" />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={isMenuCollapsed}
        onCollapse={setCollapsedMenu}
        width={300}
      >
        <div className="logo" />
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
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <PageHeader
            className="site-page-header"
            title={routes[deepestPathPart as RoutesEnum].pageTitle}
            subTitle={routes[deepestPathPart as RoutesEnum].description}
          />
        </Header>
        <div style={{ margin: '16px', opacity: '0' }}></div>
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Made for Devexperts with ❤️ by nikelborm
        </Footer>
      </Layout>
    </Layout>
  );
}
