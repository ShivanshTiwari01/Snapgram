import { useGetInfinitePosts, useSearchPosts } from '@/lib/queries';
import { GridPostList, Loader } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export function Explore() {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: postsStatus,
  } = useGetInfinitePosts();

  const { data: searchResults, status: searchStatus } =
    useSearchPosts(debouncedSearch);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !debouncedSearch) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage, debouncedSearch]);

  const isSearching = debouncedSearch.length > 0;
  const posts = isSearching
    ? searchResults || []
    : postsData?.pages.flatMap((page) => page.data) || [];
  const isLoading = isSearching
    ? searchStatus === 'pending'
    : postsStatus === 'pending';

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img
            src='/assets/icons/search.svg'
            width={24}
            height={24}
            alt='search'
          />
          <Input
            type='text'
            placeholder='Search'
            className='explore-search'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className='flex-between w-full max-w-5xl mb-5'>
        <h3 className='body-bold md:h3-bold'>Popular Today</h3>
      </div>

      {isLoading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className='text-light-4'>No posts found</p>
      ) : (
        <>
          <GridPostList posts={posts} showStats />
          {hasNextPage && !isSearching && (
            <div ref={ref} className='mt-10'>
              {isFetchingNextPage && <Loader />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
