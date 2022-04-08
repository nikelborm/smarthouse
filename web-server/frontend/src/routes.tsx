import { PieChartOutlined } from '@ant-design/icons';

export enum RoutesEnum {
  USERS = 'users',
  CLIENTS = 'clients',
  ROUTES_GRAPH = 'routesGraph',
  EVENTS = 'events',
  MESSAGES = 'messages',
}

export const routes: {
  [route in RoutesEnum]: {
    menuTitle: string;
    pageTitle: string;
    description?: string;
    icon?: React.ReactChild;
  };
} = {
  [RoutesEnum.USERS]: {
    menuTitle: 'Users',
    pageTitle: 'Users',
    description: 'Профили',
    icon: <PieChartOutlined />,
  },
  [RoutesEnum.CLIENTS]: {
    menuTitle: 'Clients',
    pageTitle: 'Clients',
    icon: <PieChartOutlined />,
  },
  [RoutesEnum.ROUTES_GRAPH]: {
    menuTitle: 'Routes graph',
    pageTitle: 'Routes graph',
    icon: <PieChartOutlined />,
  },
  [RoutesEnum.EVENTS]: {
    menuTitle: 'Events',
    pageTitle: 'Events',
    icon: <PieChartOutlined />,
  },
  [RoutesEnum.MESSAGES]: {
    menuTitle: 'Messages',
    pageTitle: 'Messages',
    icon: <PieChartOutlined />,
  },
};
