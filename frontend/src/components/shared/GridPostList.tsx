import { Link } from 'react-router-dom';
import type { IPost } from '@/types';

interface GridPostListProps {
  posts: IPost[];
  showStats?: boolean;
}

export function GridPostList({ posts, showStats = true }: GridPostListProps) {
  return (
    <ul className='grid-container'>
      {posts.map((post) => (
        <li key={post.id} className='relative min-w-80 h-80'>
          <Link to={`/posts/${post.id}`} className='grid-post_link'>
            <img
              src={post.imageUrl}
              alt='post'
              className='h-full w-full object-cover'
            />
          </Link>

          {showStats && (
            <div className='grid-post_user'>
              <div className='flex items-center justify-start gap-2 flex-1'>
                <img
                  src={
                    post.creator?.imageUrl ||
                    '/assets/images/profile-placeholder.svg'
                  }
                  alt='creator'
                  className='w-8 h-8 rounded-full'
                />
                <p className='line-clamp-1'>{post.creator?.name}</p>
              </div>
              <div className='flex gap-2'>
                <div className='flex gap-1'>
                  <img
                    src='/assets/icons/heart.svg'
                    alt='like'
                    width={20}
                    height={20}
                  />
                  <p className='small-medium'>{post.likes?.length || 0}</p>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
