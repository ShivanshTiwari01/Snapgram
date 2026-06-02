import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SignInSchemaType } from '@/lib/validation';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@/lib/queries';
import { SignInSchema } from '@/lib/validation';
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

export function SigninForm() {
  const navigate = useNavigate();
  const { mutate: signIn, isPending } = useSignIn();

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInSchemaType) => {
    signIn(values, {
      onSuccess: (data: any) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          toast.success('Logged in successfully!');
          navigate('/');
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to sign in');
      },
    });
  };

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />

        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
          Log in to your account
        </h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 w-full mt-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }: any) => (
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
            render={({ field }: any) => (
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
              'Sign In'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don't have an account?{' '}
            <a
              href='/sign-up'
              className='text-primary-500 text-small-semibold ml-1'
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </Form>
  );
}
