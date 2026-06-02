import { useParams } from 'react-router-dom';
import { PostForm } from '@/components/forms/PostForm';
import { useGetPostById } from '@/lib/queries';
import { Loader } from '@/components/shared';

export function EditPost() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading } = useGetPostById(id);

  if (isLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='edit-post'>
      <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
        <img src='/assets/icons/edit.svg' width={36} height={36} alt='edit' />
        <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Post</h2>
      </div>

      {post && <PostForm post={post} action='Update' />}
    </div>
  );
}
