import { useGetInfinitePosts } from '@/lib/queries';
import { PostCard } from '@/components/shared';
import { Loader } from '@/components/shared';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function Home() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetInfinitePosts();

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

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>

          {posts.length === 0 ? (
            <p className='text-light-4'>No posts yet</p>
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
        {/* Top creators will be added here */}
      </div>
    </div>
  );
}
