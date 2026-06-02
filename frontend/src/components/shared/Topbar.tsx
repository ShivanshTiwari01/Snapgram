import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import { useSignOut } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Topbar() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut } = useSignOut();

  const handleSignOut = async () => {
    signOut();
    navigate('/sign-in');
  };

  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <div
          onClick={() => navigate('/')}
          className='flex gap-3 items-center cursor-pointer'
        >
          <img
            src='/assets/images/logo.svg'
            alt='logo'
            width={130}
            height={325}
          />
        </div>

        <div className='flex gap-4'>
          <Button
            variant='ghost'
            className='shad-button_ghost'
            onClick={handleSignOut}
          >
            <LogOut />
          </Button>
          <img
            src={user?.imageUrl || '/assets/images/profile-placeholder.svg'}
            alt='profile'
            className='h-8 w-8 rounded-full'
          />
        </div>
      </div>
    </section>
  );
}
