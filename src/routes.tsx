import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ROUTES } from './constants/routes';
import Contact from './pages/Contact/Contact';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Portfolio from './pages/Portfolio/Portfolio';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.home, element: <Home /> },
      { path: ROUTES.portfolio, element: <Portfolio /> },
      { path: ROUTES.projectDetail, element: <ProjectDetail /> },
      { path: ROUTES.contact, element: <Contact /> },
      { path: ROUTES.notFound, element: <NotFound /> },
    ],
  },
]);
