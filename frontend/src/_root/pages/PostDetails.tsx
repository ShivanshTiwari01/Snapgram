import { useParams, useNavigate } from 'react-router-dom';
import type { IPost } from '@/types';
import { useGetPostById, useDeletePost } from '@/lib/queries';
import { PostCard, Loader, GridPostList } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: post, isLoading } = useGetPostById(id);
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts: IPost[] = []; // You can implement this by fetching posts with similar tags

  const handleDeletePost = () => {
    if (!post) return;

    deletePost(post.id, {
      onSuccess: () => {
        toast.success('Post deleted successfully!');
        navigate('/');
      },
      onError: (error: any) => {
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
          <img src={post.imageUrl} alt='creator' className='post_details-img' />

          <div className='post_details-info'>
            <div className='flex-between w-full'>
              <div className='flex items-center gap-3'>
                <img
                  src={
                    post.creator?.imageUrl ||
                    '/assets/images/profile-placeholder.svg'
                  }
                  alt='creator'
                  className='w-8 h-8 lg:w-12 lg:h-12 rounded-full'
                />
                <div className='flex flex-col'>
                  <p className='base-medium lg:body-bold text-light-1'>
                    {post.creator?.name}
                  </p>
                  <div className='flex-center gap-2 text-light-3'>
                    <p className='subtle-semibold lg:small-regular'>
                      {new Date(post.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {user?.id === post.creatorId && (
                <Button
                  onClick={handleDeletePost}
                  variant='ghost'
                  className={`LeftSidebar_delete-btn`}
                >
                  <Trash2 />
                </Button>
              )}
            </div>

            <hr className='border w-full border-dark-4/80' />

            <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
              <p>{post.caption}</p>
              {post.tags && post.tags.length > 0 && (
                <ul className='flex gap-1 mt-2'>
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
              <PostCard post={post} />
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
