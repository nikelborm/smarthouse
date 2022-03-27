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
import { usePath } from 'hooks';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />

      <Route path="/auth" element={<AuthWrapper />}>
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Register />} />
        <Route path="*" element={<Navigate to="login" />} />
      </Route>

      <Route path="/adminPanel" element={<AdminPanelWrapper />}>
        <Route path="profile" element={<Profile />} />
        <Route path="clients" element={<Clients />} />
        <Route path="routesGraph" element={<RoutesGraph />} />
        <Route path="events" element={<Events />} />
        <Route path="messages" element={<Messages />} />
        <Route path="*" element={<Navigate to="profile" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function AuthWrapper() {
  const { deepestPathPart } = usePath();
  if (deepestPathPart === 'auth') return <Navigate to="login" />;

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
