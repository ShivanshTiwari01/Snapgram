// User types
export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  imageUrl?: string;
  imageId?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface INewUser {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface IUpdateUser {
  userId: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  imageId?: string;
  file?: File[];
}

// Post types
export interface IPost {
  id: string;
  creatorId: string;
  caption: string;
  imageUrl: string;
  imageId: string;
  location?: string;
  tags?: string[];
  likes?: string[];
  saves?: ISave[];
  creator?: IUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface INewPost {
  caption: string;
  file?: File[];
  location?: string;
  tags?: string;
}

export interface IUpdatePost {
  postId: string;
  caption: string;
  file?: File[];
  location?: string;
  tags?: string;
  imageUrl?: string;
  imageId?: string;
}

// Save types
export interface ISave {
  id: string;
  userId: string;
  postId: string;
  post?: IPost;
  createdAt?: string;
}

// Auth response types
export interface IAuthResponse {
  access_token: string;
}

// API response types
export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
