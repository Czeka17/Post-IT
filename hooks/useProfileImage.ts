import { useState, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import FileResizer from 'react-image-file-resizer';

const cloudName = 'dmn5oy2qa';
const cld = new Cloudinary({ cloud: { cloudName: cloudName } });

const useProfileImage = (initialImage:string, username:string) => {
  const [selectedImage, setSelectedImage] = useState(initialImage);

  async function changeProfileHandler(image:string, username:string){
    const response = await fetch('/api/user/changeImage', {
      method: 'POST',
      body: JSON.stringify({image, username}),
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    const data = await response.json();

  }

  const selectImageHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      FileResizer.imageFileResizer(
        file,
        1000,
        1000,
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
                  const imageUrl = cld.image(data.public_id);
                  setSelectedImage(imageUrl.toURL());
                  changeProfileHandler(imageUrl.toURL(),username)
                })
                .catch((error) => {
                  console.log('Upload error:', error);
                });
            };
            reader.readAsDataURL(resizedImage);
          }
        },
        'blob'
      );
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('upload_preset', 'ewqicijo');

      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = cld.image(data.public_id);
          changeProfileHandler(imageUrl.toURL(),username)
        })
        .catch((error) => {
          console.log('Upload error:', error);
        });
    }
  }, [selectedImage]);

  return { selectImageHandler };
};

export default useProfileImage;
