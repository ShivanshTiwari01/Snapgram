import { Link, NavLink } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import { useSignOut } from '@/lib/queries';
import { sidebarLinks } from '@/constants';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LeftSidebar() {
  const { user } = useUserContext();
  const { mutate: signOut } = useSignOut();

  const handleSignOut = async () => {
    signOut();
    window.location.href = '/sign-in';
  };

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-3 items-center'>
          <img
            src='/assets/images/logo.svg'
            alt='logo'
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user?.id}`} className='flex gap-3 items-center'>
          <img
            src={user?.imageUrl || '/assets/images/profile-placeholder.svg'}
            alt='profile'
            className='h-14 w-14 rounded-full'
          />
          <div className='flex flex-col'>
            <p className='body-bold'>{user?.name}</p>
            <p className='small-regular text-light-3'>@{user?.username}</p>
          </div>
        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.route}
                className={({ isActive }) =>
                  `leftsidebar-link ${isActive && 'bg-primary-500'}`
                }
              >
                <img
                  src={link.imgURL}
                  alt={link.label}
                  width={20}
                  height={20}
                />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant='ghost'
        className='shad-button_ghost'
        onClick={handleSignOut}
      >
        <LogOut />
        <p>Logout</p>
      </Button>
    </nav>
  );
}
