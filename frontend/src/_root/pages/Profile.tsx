import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserById, useGetUserPosts } from '@/lib/queries';
import { GridPostList, Loader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { Edit2 } from 'lucide-react';

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();
  const { data: user, isLoading: userLoading } = useGetUserById(id);
  const { data: userPosts, isLoading: postsLoading } = useGetUserPosts(id);

  const isCurrentUserProfile = currentUser?.id === id;

  if (userLoading || postsLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className='flex xl:flex-row flex-col max-w-5xl w-full gap-0 rounded-[30px] bg-dark-1 px-0 pb-32 md:mb-10 md:pb-10'>
          <img
            src={user?.imageUrl || '/assets/images/profile-placeholder.svg'}
            alt='profile'
            className='w-full h-64 object-cover rounded-r-[90px] xl:w-1/2'
          />

          <div className='profile-card pt-5 px-8'>
            <div className='flex justify-between items-start z-20 w-full'>
              <div className='flex flex-col'>
                <h1 className='text-center xl:text-left h3-bold md:h1-semibold w-full'>
                  {user?.name}
                </h1>
                <p className='small-regular md:body-medium text-light-3 text-center xl:text-left'>
                  @{user?.username}
                </p>
              </div>
              {isCurrentUserProfile && (
                <Button
                  onClick={() => navigate(`/update-profile/${id}`)}
                  variant='ghost'
                  className='shad_button_ghost_1'
                >
                  <Edit2 width={20} height={20} />
                  Edit
                </Button>
              )}
            </div>

            <div className='flex gap-8 items-center justify-center xl:justify-start flex-wrap z-20 w-full mt-10'>
              <div className='flex-center gap-2'>
                <p className='small-semibold lg:body-bold text-primary-500'>
                  {userPosts?.length || 0}
                </p>
                <p className='small-medium lg:base-medium text-light-2'>
                  Posts
                </p>
              </div>
            </div>

            <p className='small-medium lg:base-medium text-center xl:text-left mt-7 max-w-screen-sm text-light-2'>
              {user?.bio || 'No bio'}
            </p>
          </div>
        </div>

        {currentUser?.id === user?.id && (
          <div className='max-w-5xl w-full'>
            <hr className='border w-full border-dark-4/80' />

            <div className='w-full max-w-5xl mt-10 mb-10'>
              <h3 className='body-bold md:h3-bold w-full'>
                {isCurrentUserProfile ? 'Your Posts' : `${user?.name}'s Posts`}
              </h3>
            </div>
          </div>
        )}
      </div>

      {userPosts && userPosts.length > 0 ? (
        <div className='w-full max-w-5xl'>
          <GridPostList
            posts={userPosts}
            showStats={currentUser?.id === user?.id}
          />
        </div>
      ) : (
        <p className='text-light-4 mt-10'>
          {isCurrentUserProfile ? 'No posts yet' : `${user?.name} has no posts`}
        </p>
      )}
    </div>
  );
}
