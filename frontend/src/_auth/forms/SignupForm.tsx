import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SignUpSchemaType } from '@/lib/validation';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@/lib/queries';
import { SignUpSchema } from '@/lib/validation';
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
import { Loader } from '@/components/shared';
import toast from 'react-hot-toast';

export function SignupForm() {
  const navigate = useNavigate();
  const { mutate: signUp, isPending } = useSignUp();

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignUpSchemaType) => {
    signUp(values, {
      onSuccess: (data) => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          toast.success('Account created successfully!');
          navigate('/');
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to sign up');
      },
    });
  };

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />

        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
          Create a new account
        </h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>
          To use snapgram, please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 w-full mt-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='shad-input'
                    placeholder='Enter your name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Username</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='shad-input'
                    placeholder='Enter your username'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    className='shad-input'
                    placeholder='Enter your email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    className='shad-input'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='shad-button_primary w-full'
            disabled={isPending}
          >
            {isPending ? (
              <div className='flex-center gap-2'>
                <Loader size='sm' />
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Already have an account?{' '}
            <a
              href='/sign-in'
              className='text-primary-500 text-small-semibold ml-1'
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </Form>
  );
}
