import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetPostById, useDeletePost } from '@/lib/queries';
import { Loader, GridPostList, PostStats } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatTime } from '@/lib/utils';
import type { IPost } from '@/types';

export function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: post, isLoading } = useGetPostById(id);
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts: IPost[] = []; // Can be implemented by fetching posts with similar tags

  const handleDeletePost = () => {
    if (!post) return;

    deletePost(post.id, {
      onSuccess: () => {
        toast.success('Post deleted successfully!');
        navigate('/');
      },
      onError: (error: Error & { response?: { data?: { message?: string } } }) => {
        toast.error(error.response?.data?.message || 'Failed to delete post');
      },
    });
  };

  if (isLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='post_details-container'>
      <div className='hidden md:flex max-w-5xl w-full'>
        <Button
          onClick={() => navigate(-1)}
          variant='ghost'
          className='shad-button_ghost'
        >
          <img src='/assets/icons/back.svg' alt='back' width={20} height={20} />
          <p>Back</p>
        </Button>
      </div>

      {post && (
        <div className='post_details-card'>
          <img src={post.imageUrl} alt='post' className='post_details-img' />

          <div className='post_details-info'>
            <div className='flex-between w-full'>
              <div className='flex items-center gap-3'>
                <Link to={`/profile/${post.creatorId}`}>
                  <img
                    src={
                      post.creator?.imageUrl ||
                      '/assets/images/profile-placeholder.svg'
                    }
                    alt='creator'
                    className='w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover'
                  />
                </Link>
                <div className='flex flex-col'>
                  <Link to={`/profile/${post.creatorId}`}>
                    <p className='base-medium lg:body-bold text-light-1'>
                      {post.creator?.name}
                    </p>
                  </Link>
                  <div className='flex-center gap-2 text-light-3'>
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

              {user?.id === post.creatorId && (
                <div className='flex gap-2'>
                  <Button
                    onClick={() => navigate(`/update-post/${post.id}`)}
                    variant='ghost'
                    className='shad-button_ghost'
                  >
                    <img
                      src='/assets/icons/edit.svg'
                      alt='edit'
                      width={20}
                      height={20}
                    />
                  </Button>
                  <Button
                    onClick={handleDeletePost}
                    variant='ghost'
                    className='post_details-delete_btn'
                  >
                    <Trash2 className='w-5 h-5' />
                  </Button>
                </div>
              )}
            </div>

            <hr className='border w-full border-dark-4/80' />

            <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
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

            <div className='w-full'>
              <PostStats post={post} userId={user?.id || ''} />
            </div>
          </div>
        </div>
      )}

      <div className='w-full max-w-5xl'>
        <hr className='border w-full border-dark-4/80' />

        <h3 className='body-bold md:h3-bold w-full my-10'>
          More Related Posts
        </h3>

        {relatedPosts.length > 0 ? (
          <GridPostList posts={relatedPosts} showStats />
        ) : (
          <p className='text-light-4'>No related posts found</p>
        )}
      </div>
    </div>
  );
}
