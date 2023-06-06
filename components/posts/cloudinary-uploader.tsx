import { ChangeEvent, useRef, useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import FileResizer from 'react-image-file-resizer';
import classes from './cloudinary-uploader.module.css'
const cloudName = 'dmn5oy2qa';
const cld = new Cloudinary({ cloud: { cloudName: cloudName } });

interface CloudinaryUploaderProps {
  onUpload: (media: { type: 'image' | 'video' | 'gif'; url: string }) => void;
}

function CloudinaryUploader({ onUpload }: CloudinaryUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  function addMediaHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'mp4' || fileExtension === 'webm') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ewqicijo');
        formData.append('resource_type', 'video');
        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            const videoUrl = cld.video(data.public_id).toURL();
            onUpload({ type: 'video', url: videoUrl });
            setIsLoading(false);
          })
          .catch((error) => {
            console.log('Upload error:', error);
            setIsLoading(false);
          });
      } else if (fileExtension === 'gif') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ewqicijo');
        formData.append('resource_type', 'auto');

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            const gifUrl = cld.image(data.public_id).toURL();
            onUpload({ type: 'gif', url: gifUrl });
            setIsLoading(false);
          })
          .catch((error) => {
            console.log('Upload error:', error);
            setIsLoading(false);
          });
      } else {
        FileResizer.imageFileResizer(
          file,
          800,
          800,
          'PNG',
          100,
          0,
          (resizedImage) => {
            if (resizedImage instanceof File || resizedImage instanceof Blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const convertedFile = new File([resizedImage], file.name, {
                  type: file.type,
                  lastModified: file.lastModified,
                });

                const formData = new FormData();
                formData.append('file', convertedFile);
                formData.append('upload_preset', 'ewqicijo');

                fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                  method: 'POST',
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((data) => {
                    const imageUrl = cld.image(data.public_id).toURL();
                    onUpload({ type: 'image', url: imageUrl });
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    console.log('Upload error:', error);
                    setIsLoading(false);
                  });
              };
              reader.readAsDataURL(resizedImage);
            } else {
              console.log('Invalid resized image type:', typeof resizedImage);
              setIsLoading(false);
            }
          },
          'blob'
        );
      }
    }
  }

  return (
    <input className={classes.fileInput} type="file" name="file" onChange={addMediaHandler} />
  );
}

export default CloudinaryUploader;
