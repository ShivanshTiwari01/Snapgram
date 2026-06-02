import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  fieldChange: (files: File[]) => void;
  mediaUrl?: string;
}

export function FileUploader({ fieldChange, mediaUrl }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      fieldChange(acceptedFiles);
    },
    [fieldChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
  });

  return (
    <div
      className='flex flex-center flex-col rounded-xl border-2 border-dashed border-light-4 bg-dark-3 px-4 py-8 cursor-pointer hover:bg-dark-4 transition-colors'
      {...getRootProps()}
    >
      <input {...getInputProps()} className='cursor-pointer' />

      {mediaUrl ? (
        <>
          <div className='flex w-full flex-1 justify-center p-5 lg:p-10'>
            <img
              src={mediaUrl}
              alt='post'
              className='file_uploader-img rounded-lg max-h-[400px]'
            />
          </div>
          <p className='text-light-4 small-regular w-full text-center'>
            Click or drag photo to replace
          </p>
        </>
      ) : (
        <div className='file_uploader-box'>
          <Upload className='w-8 h-8 text-light-4 mb-2' />

          <h3 className='mb-2 mt-2 text-white'>Drag photo here</h3>
          <p className='small-regular mb-6 text-light-4'>SVG, PNG, JPG, GIF</p>

          <button className='shad-button_dark_4'>Select from computer</button>
        </div>
      )}
    </div>
  );
}
