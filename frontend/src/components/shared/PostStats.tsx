import type { IPost } from '@/types';
import { useLikePost, useSavePost, useUnsavePost } from '@/lib/queries';
import { Heart, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface PostStatsProps {
  post: IPost;
  userId: string;
}

export function PostStats({ post, userId }: PostStatsProps) {
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: unsavePost } = useUnsavePost();

  const [likes, setLikes] = useState<string[]>(post.likes || []);
  const [isSaved, setIsSaved] = useState(false);

  const isLiked = likes.includes(userId);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLiked) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }

    likePost(post.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSaved) {
      // Find and delete the save record
      const saveId = post.saves?.find((s) => s.userId === userId)?.id;
      if (saveId) {
        unsavePost(saveId);
      }
      setIsSaved(false);
    } else {
      savePost(post.id);
      setIsSaved(true);
    }
  };

  return (
    <div className='flex justify-between items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <button
          onClick={handleLike}
          className='flex gap-2 items-center cursor-pointer'
        >
          <Heart
            className={`w-5 h-5 transition ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-light-3'
            }`}
          />
          <p className='small-medium lg:base-medium'>{likes.length}</p>
        </button>
      </div>

      <button
        onClick={handleSave}
        className='flex gap-2 items-center cursor-pointer'
      >
        <Bookmark
          className={`w-5 h-5 transition ${
            isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-light-3'
          }`}
        />
      </button>
    </div>
  );
}
