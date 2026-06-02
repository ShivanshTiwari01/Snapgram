import { useGetUsers } from '@/lib/queries';
import { UserCard, Loader } from '@/components/shared';
import { type IUser } from '@/types';

export function AllUsers() {
  const { data: users, isLoading } = useGetUsers();

  if (isLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='common-container'>
      <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
        <img
          src='/assets/icons/people.svg'
          width={36}
          height={36}
          alt='people'
        />
        <h2 className='h3-bold md:h2-bold text-left w-full'>All Users</h2>
      </div>

      {users && users.length > 0 ? (
        <ul className='user-grid'>
          {users.map((user: IUser) => (
            <li key={user.id} className='flex-1 min-w-[200px] w-full'>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-light-4 mt-10'>No users found</p>
      )}
    </div>
  );
}
