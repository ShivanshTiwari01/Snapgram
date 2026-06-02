import { PostForm } from '@/components/forms/PostForm';

export function CreatePost() {
  return (
    <div className='create-post'>
      <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
        <img
          src='/assets/icons/gallery-add.svg'
          width={36}
          height={36}
          alt='add'
        />
        <h2 className='h3-bold md:h2-bold text-left w-full'>Create Post</h2>
      </div>

      <PostForm action='Create' />
    </div>
  );
}
