import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';

function MainLayout() {
  return (
    <div className='flex min-h-screen flex-col bg-canvas font-geist text-ink'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer theme='colored' position='bottom-right' />
      <ScrollRestoration />
    </div>
  );
}

export default MainLayout;
