import { useGetSavedPosts } from '@/lib/queries';
import { GridPostList, Loader } from '@/components/shared';

export function Saved() {
  const { data: saves, isLoading } = useGetSavedPosts();

  const savePosts = saves?.map((save) => save.post).filter(Boolean) || [];

  if (isLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='saved-container'>
      <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
        <img src='/assets/icons/save.svg' width={36} height={36} alt='save' />
        <h2 className='h3-bold md:h2-bold text-left w-full'>Saved Posts</h2>
      </div>

      {savePosts.length === 0 ? (
        <p className='text-light-4 mt-10'>No saved posts yet</p>
      ) : (
        <ul className='w-full gap-9 max-w-5xl'>
          <GridPostList posts={savePosts} showStats={false} />
        </ul>
      )}
    </div>
  );
}
