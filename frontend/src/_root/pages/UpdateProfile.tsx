import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UpdateUserSchemaType } from '@/lib/validation';
import { useGetUserById, useUpdateUser } from '@/lib/queries';
import { UpdateUserSchema } from '@/lib/validation';
import { useUserContext } from '@/context/AuthContext';
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
import { Button } from '@/components/ui/button';
import { FileUploader, Loader } from '@/components/shared';
import { convertFileToUrl } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function UpdateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();
  const { data: user, isLoading: userLoading } = useGetUserById(id);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || '');

  const form = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      file: [],
    },
  });

  const handleFile = (files: File[]) => {
    const url = convertFileToUrl(files[0]);
    setImageUrl(url);
    form.setValue('file', files);
  };

  const onSubmit = async (values: UpdateUserSchemaType) => {
    updateUser(
      {
        userId: id || '',
        ...values,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully!');
          navigate(`/profile/${id}`);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || 'Failed to update profile',
          );
        },
      },
    );
  };

  if (userLoading) {
    return (
      <div className='flex-center w-full h-screen'>
        <Loader />
      </div>
    );
  }

  if (currentUser?.id !== id) {
    navigate('/');
    return null;
  }

  return (
    <div className='common-container'>
      <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
        <img src='/assets/icons/edit.svg' width={36} height={36} alt='edit' />
        <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Profile</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-7 w-full max-w-5xl'
        >
          <FormField
            control={form.control}
            name='file'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>
                  Add Profile Photo
                </FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={(files) => handleFile(files)}
                    mediaUrl={imageUrl}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Name</FormLabel>
                <FormControl>
                  <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bio'
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Tell us about yourself'
                    className='shad-textarea custom-scrollbar'
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
              disabled={isPending}
            >
              {isPending ? (
                <div className='flex-center gap-2'>
                  <Loader size='sm' />
                  Updating
                </div>
              ) : (
                'Update Profile'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
