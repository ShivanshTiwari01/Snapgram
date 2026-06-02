import { useGetInfinitePosts, useGetUsers } from '@/lib/queries';
import { PostCard } from '@/components/shared';
import { Loader } from '@/components/shared';
import { UserCard } from '@/components/shared';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function Home() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetInfinitePosts();

  const { data: creators, isLoading: creatorsLoading } = useGetUsers();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'pending') {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  // Backend returns { data: posts[], meta: {...} } per page
  const posts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>

          {posts.length === 0 ? (
            <p className='text-light-4'>No posts yet. Be the first to post!</p>
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {posts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasNextPage && (
          <div ref={ref} className='mt-10'>
            {isFetchingNextPage && <Loader />}
          </div>
        )}
      </div>

      <div className='home-creators'>
        <h3 className='h3-bold text-light-1'>Top Creators</h3>
        {creatorsLoading ? (
          <Loader />
        ) : (
          <ul className='grid 2xl:grid-cols-2 gap-6'>
            {creators?.slice(0, 10).map((creator) => (
              <li key={creator.id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
