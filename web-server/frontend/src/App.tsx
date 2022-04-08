import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AdminPanelWrapper } from 'components';
import {
  Events,
  Login,
  MessagesDashboard,
  Register,
  Root,
  RoutesGraph,
  Clients,
  SpecificClient,
  SpecificUser,
  Users,
  SpecificEvent,
} from 'pages';
import { usePath } from 'hooks';
import { useAuthedUser } from 'utils/authContext';

function App() {
  const { isAuthed } = useAuthedUser();
  usePath();
  return (
    <Routes>
      <Route path="/" element={<Root />} />

      <Route path="/auth" element={<AuthWrapper />}>
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Register />} />
        <Route
          path="*"
          element={
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthed ? '/adminPanel/routesGraph' : '/auth/login'}
                />
              }
            />
          }
        />
      </Route>

      <Route path="/adminPanel" element={<AdminPanelWrapper />}>
        <Route path="routesGraph" element={<RoutesGraph />} />

        <Route path="clients" element={<Clients />} />

        {/* TODO: add page below */}
        <Route path="client/:id" element={<SpecificClient />} />

        <Route path="users" element={<Users />} />

        <Route path="users/:id" element={<SpecificUser />} />

        <Route path="events" element={<Events />} />

        <Route path="events/:id" element={<SpecificEvent />} />

        <Route path="messagesDashboard" element={<MessagesDashboard />} />

        <Route
          path="*"
          element={
            <Navigate
              to={isAuthed ? '/adminPanel/routesGraph' : '/auth/login'}
            />
          }
        />
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
