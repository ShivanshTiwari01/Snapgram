import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import './globals.css';
import { SigninForm } from './_auth/forms/SigninForm';
import { SignupForm } from './_auth/forms/SignupForm';
import { AuthLayout } from './_auth/AuthLayout';
import { RootLayout } from './_root/RootLayout';
import {
  Home,
  Explore,
  Saved,
  AllUsers,
  CreatePost,
  EditPost,
  PostDetails,
  Profile,
  UpdateProfile,
  LikedPosts,
} from './_root/pages';
import { AuthProvider } from '@/context/AuthContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position='top-right' />
        <main className='flex h-screen'>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path='/sign-up' element={<SignupForm />} />
              <Route path='/sign-in' element={<SigninForm />} />
            </Route>

            {/* App Routes */}
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path='/explore' element={<Explore />} />
              <Route path='/saved' element={<Saved />} />
              <Route path='/all-users' element={<AllUsers />} />
              <Route path='/create-post' element={<CreatePost />} />
              <Route path='/update-post/:id' element={<EditPost />} />
              <Route path='/posts/:id' element={<PostDetails />} />
              <Route path='/profile/:id' element={<Profile />} />
              <Route path='/profile/:id/liked-posts' element={<LikedPosts />} />
              <Route path='/update-profile/:id' element={<UpdateProfile />} />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </QueryClientProvider>
  );
}
