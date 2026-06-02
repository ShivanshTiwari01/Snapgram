import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import { Topbar, LeftSidebar, Bottombar, Loader } from '@/components/shared';

export function RootLayout() {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <div className='w-full md:flex'>
          <Topbar />
          <LeftSidebar />

          <section className='flex flex-1 flex-col h-full bg-dark-1'>
            <Outlet />
          </section>

          <Bottombar />
        </div>
      ) : (
        <Navigate to='/sign-in' />
      )}
    </>
  );
}
