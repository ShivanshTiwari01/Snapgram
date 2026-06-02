import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import { Loader } from '@/components/shared';

export function AuthLayout() {
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
        <Navigate to='/' />
      ) : (
        <div className='flex h-screen w-full'>
          <section className='flex flex-1 justify-center items-center flex-col py-10'>
            <Outlet />
          </section>
          <img
            src='/assets/images/side-img.svg'
            className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat'
            alt='side'
          />
        </div>
      )}
    </>
  );
}
