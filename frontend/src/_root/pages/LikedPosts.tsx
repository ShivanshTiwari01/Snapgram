import { useGetUserById, useGetUserPosts } from '@/lib/queries';
import { useParams } from 'react-router-dom';
import { GridPostList, Loader } from '@/components/shared';

export function LikedPosts() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading: userLoading } = useGetUserById(id);
  const { data: userPosts, isLoading: postsLoading } = useGetUserPosts(id);

  const likedPosts =
    userPosts?.filter((post) => post.likes?.length ?? 0 > 0) || [];

  if (userLoading || postsLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='common-container'>
      <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
        <img src='/assets/icons/heart.svg' width={36} height={36} alt='liked' />
        <h2 className='h3-bold md:h2-bold text-left w-full'>
          {user?.name}'s Liked Posts
        </h2>
      </div>

      {likedPosts.length > 0 ? (
        <ul className='w-full gap-9 max-w-5xl'>
          <GridPostList posts={likedPosts} showStats={false} />
        </ul>
      ) : (
        <p className='text-light-4 mt-10'>No liked posts</p>
      )}
    </div>
  );
}
