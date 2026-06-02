import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreatePostSchemaType } from '@/lib/validation';
import type { IPost } from '@/types';
// AuthContext imported for potential future use (user ownership checks)
import { useCreatePost, useUpdatePost } from '@/lib/queries';
import { CreatePostSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader, Loader } from '@/components/shared';
import { convertFileToUrl } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface PostFormProps {
  post?: IPost;
  action: 'Create' | 'Update';
}

export function PostForm({ post, action }: PostFormProps) {
  const navigate = useNavigate();
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const [mediaUrl, setMediaUrl] = useState(post?.imageUrl || '');

  const form = useForm<CreatePostSchemaType>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      caption: post?.caption || '',
      file: [],
      location: post?.location || '',
      tags: post?.tags?.join(', ') || '',
    },
  });

  const handleFile = (files: File[]) => {
    const url = convertFileToUrl(files[0]);
    setMediaUrl(url);
    form.setValue('file', files);
  };

  const onSubmit = async (values: CreatePostSchemaType) => {
    if (action === 'Create') {
      createPost(
        { ...values },
        {
          onSuccess: () => {
            toast.success('Post created successfully!');
            form.reset();
            navigate('/');
          },
          onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(
              error.response?.data?.message || 'Failed to create post',
            );
          },
        },
      );
    } else if (post) {
      updatePost(
        {
          postId: post.id,
          ...values,
        },
        {
          onSuccess: () => {
            toast.success('Post updated successfully!');
            navigate(`/posts/${post.id}`);
          },
          onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(
              error.response?.data?.message || 'Failed to update post',
            );
          },
        },
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-9 w-full max-w-5xl'
      >
        <FormField
          control={form.control}
          name='caption'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Caption</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's on your mind?"
                  className='shad-textarea custom-scrollbar'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='file'
          render={() => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={handleFile} mediaUrl={mediaUrl} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Location</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='shad-input'
                  placeholder='Sydney'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='React, NextJs, JavaScript'
                  className='shad-input'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-4 items-center justify-end'>
          <Button
            type='button'
            className='shad-button_dark_4'
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='shad-button_primary whitespace-nowrap'
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <div className='flex-center gap-2'>
                <Loader size='sm' />
                {action}ing
              </div>
            ) : (
              `${action} Post`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
