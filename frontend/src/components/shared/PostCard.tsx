import { Link } from 'react-router-dom';
import { formatTime } from '@/lib/utils';
import type { IPost } from '@/types';
import { PostStats } from './PostStats';
import { useUserContext } from '@/context/AuthContext';

interface PostCardProps {
  post: IPost;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useUserContext();
  const isOwner = user?.id === post.creatorId;

  return (
    <div className='post-card'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${post.creatorId}`}>
            <img
              src={
                post.creator?.imageUrl ||
                '/assets/images/profile-placeholder.svg'
              }
              alt='creator'
              className='w-8 h-8 lg:h-12 lg:w-12 rounded-full object-cover'
            />
          </Link>

          <div className='flex flex-col'>
            <Link to={`/profile/${post.creatorId}`}>
              <p className='base-medium lg:body-bold text-light-1'>
                {post.creator?.name}
              </p>
            </Link>
            <div className='flex items-center gap-2 text-light-3'>
              <p className='subtle-semibold lg:small-regular'>
                {formatTime(post.createdAt || '')}
              </p>
              {post.location && (
                <>
                  <span>•</span>
                  <p className='subtle-semibold lg:small-regular'>
                    {post.location}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <Link to={`/update-post/${post.id}`}>
            <img src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
          </Link>
        )}
      </div>

      <Link to={`/posts/${post.id}`}>
        <div className='small-medium lg:base-medium py-5'>
          <p>{post.caption}</p>
          {post.tags && post.tags.length > 0 && (
            <ul className='flex gap-1 mt-2 flex-wrap'>
              {post.tags.map((tag: string) => (
                <li
                  key={`${post.id}${tag}`}
                  className='text-light-3 small-regular'
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <img
          src={post.imageUrl}
          className='h-64 xs:h-80 lg:h-[450px] w-full rounded-[12px] object-cover'
          alt='post'
        />
      </Link>

      {user && <PostStats post={post} userId={user.id} />}
    </div>
  );
}
