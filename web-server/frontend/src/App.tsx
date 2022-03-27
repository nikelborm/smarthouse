import { Route, Routes, Navigate, Outlet, useMatch } from 'react-router-dom';
import { AdminPanelWrapper } from 'components';
import {
  Events,
  Login,
  Messages,
  Profile,
  Register,
  Root,
  RoutesGraph,
} from 'pages';
import Clients from 'pages/Clients/Clients';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}></Route>
      <Route path="/auth" element={<AuthWrapper />}>
        <Route path="login" element={<Login />}></Route>
        <Route path="registration" element={<Register />}></Route>
        <Route path="*" element={<Navigate to="login" />} />
      </Route>
      <Route path="/adminPanel" element={<AdminPanelWrapper />}>
        <Route path="profile" element={<Profile />}></Route>
        <Route path="clients" element={<Clients />}></Route>
        <Route path="routesGraph" element={<RoutesGraph />}></Route>
        <Route path="events" element={<Events />}></Route>
        <Route path="messages" element={<Messages />}></Route>
        <Route path="*" element={<Navigate to="profile" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function AuthWrapper() {
  const isAdminPanelOpened = useMatch('auth');
  if (isAdminPanelOpened) {
    return <Navigate to="login" />;
  }

  return (
    <div>
      auth wrapper{' '}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
export default App;
