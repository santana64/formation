import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import Dashboard from './pages/Dashboard';
import Attestation from './pages/Attestation';
import Search from './pages/Search';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import RequireAuth from './components/RequireAuth';
import AdminUsers from './pages/admin/AdminUsers';
import TrainerCourses from './pages/admin/TrainerCourses';
import TrainerExams from './pages/admin/TrainerExams';
import CourseEditor from './pages/admin/CourseEditor';
import OrgLearners from './pages/admin/OrgLearners';
import { AuthProvider } from './lib/auth';
import NotFound from './pages/NotFound';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/features.css';
import './styles/auth.css';
import './styles/admin.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'formations', element: <Catalogue /> },
      { path: 'formations/:courseId', element: <CoursePage /> },
      { path: 'formations/:courseId/modules/:moduleId/lecons/:lessonId', element: <LessonPage /> },
      { path: 'formations/:courseId/modules/:moduleId/qcm', element: <QuizPage /> },
      { path: 'formations/:courseId/attestation', element: <Attestation /> },
      { path: 'recherche', element: <Search /> },
      { path: 'progression', element: <Dashboard /> },
      { path: 'a-propos', element: <About /> },
      { path: 'connexion', element: <SignIn /> },
      { path: 'inscription', element: <SignUp /> },
      {
        path: 'compte',
        element: (
          <RequireAuth>
            <Account />
          </RequireAuth>
        ),
      },
      {
        path: 'formateur',
        element: (
          <RequireAuth roles={['formateur']}>
            <TrainerCourses />
          </RequireAuth>
        ),
      },
      {
        path: 'formateur/examens',
        element: (
          <RequireAuth roles={['formateur']}>
            <TrainerExams />
          </RequireAuth>
        ),
      },
      {
        path: 'formateur/cours/:courseId',
        element: (
          <RequireAuth roles={['formateur']}>
            <CourseEditor />
          </RequireAuth>
        ),
      },
      {
        path: 'entreprise',
        element: (
          <RequireAuth roles={['referent_entreprise']}>
            <OrgLearners />
          </RequireAuth>
        ),
      },
      {
        path: 'admin/comptes',
        element: (
          <RequireAuth roles={['admin']}>
            <AdminUsers />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
