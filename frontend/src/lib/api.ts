import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  IUser,
  INewUser,
  IUpdateUser,
  IPost,
  INewPost,
  IUpdatePost,
  ISave,
  IAuthResponse,
} from '@/types';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL =
      import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/sign-in';
        }
        return Promise.reject(error);
      },
    );
  }

  async signup(user: INewUser): Promise<IAuthResponse> {
    const response = await this.client.post<IAuthResponse>(
      '/auth/signup',
      user,
    );
    return response.data;
  }

  async signin(credentials: {
    email: string;
    password: string;
  }): Promise<IAuthResponse> {
    const response = await this.client.post<IAuthResponse>(
      '/auth/signin',
      credentials,
    );
    return response.data;
  }

  async signout(): Promise<void> {
    await this.client.post('/auth/signout');
    localStorage.removeItem('token');
  }

  async getCurrentUser(): Promise<IUser> {
    const response = await this.client.get<IUser>('/auth/me');
    return response.data;
  }

  // eslint-disable-next-line
  async createPost(post: INewPost, creatorId: string): Promise<IPost> {
    const formData = new FormData();
    formData.append('caption', post.caption);
    formData.append('location', post.location || '');
    formData.append('tags', post.tags || '');
    if (post.file && post.file[0]) {
      formData.append('image', post.file[0]);
    }

    const response = await this.client.post<IPost>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updatePost(post: IUpdatePost): Promise<IPost> {
    const formData = new FormData();
    formData.append('caption', post.caption);
    formData.append('location', post.location || '');
    formData.append('tags', post.tags || '');
    if (post.file && post.file[0]) {
      formData.append('image', post.file[0]);
    }

    const response = await this.client.patch<IPost>(
      `/posts/${post.postId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  async deletePost(postId: string): Promise<void> {
    await this.client.delete(`/posts/${postId}`);
  }

  async getPostById(postId: string): Promise<IPost> {
    const response = await this.client.get<IPost>(`/posts/${postId}`);
    return response.data;
  }

  async getPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: IPost[]; total: number }> {
    const response = await this.client.get<{ posts: IPost[]; total: number }>(
      `/posts?page=${page}&limit=${limit}`,
    );
    return response.data;
  }

  async searchPosts(query: string): Promise<IPost[]> {
    const response = await this.client.get<IPost[]>(`/posts/search?q=${query}`);
    return response.data;
  }

  async likePost(postId: string): Promise<IPost> {
    const response = await this.client.patch<IPost>(`/posts/${postId}/like`);
    return response.data;
  }

  async getUsers(): Promise<IUser[]> {
    const response = await this.client.get<IUser[]>('/users');
    return response.data;
  }

  async getUserById(userId: string): Promise<IUser> {
    const response = await this.client.get<IUser>(`/users/${userId}`);
    return response.data;
  }

  async getUserPosts(userId: string): Promise<IPost[]> {
    const response = await this.client.get<IPost[]>(`/users/${userId}/posts`);
    return response.data;
  }

  async updateUser(user: IUpdateUser): Promise<IUser> {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('bio', user.bio || '');
    if (user.imageUrl) {
      formData.append('imageUrl', user.imageUrl);
    }
    if (user.file && user.file[0]) {
      formData.append('image', user.file[0]);
    }

    const response = await this.client.patch<IUser>(
      `/users/${user.userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  async savePost(postId: string): Promise<ISave> {
    const response = await this.client.post<ISave>('/saves', { postId });
    return response.data;
  }

  async unsavePost(saveId: string): Promise<void> {
    await this.client.delete(`/saves/${saveId}`);
  }

  async getSavedPosts(): Promise<ISave[]> {
    const response = await this.client.get<ISave[]>('/saves');
    return response.data;
  }
}

export const apiClient = new APIClient();
