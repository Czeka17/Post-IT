import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import classes from './add-post.module.css';
import { Cloudinary } from '@cloudinary/url-gen';
import FileResizer from 'react-image-file-resizer';

const cloudName = 'dmn5oy2qa';

const cld = new Cloudinary({ cloud: { cloudName: cloudName } });

interface NewPostProps {
  onAddPost: (postData: PostData) => void;
  name: string;
  userImage: string;
}

interface PostData {
  message: string;
  name: string;
  userImage: string;
  image: {
    type: 'image' | 'video' | 'gif';
    url: string;
  } | null;
}

function NewPost(props: NewPostProps) {
  const [media, setMedia] = useState<{ type: 'image' | 'video' | 'gif'; url: string } | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addMediaHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
      if (fileExtension === 'mp4' || fileExtension === 'webm') {
        // Handle video upload using Cloudinary API
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
            const videoUrl = cld.video(data.public_id);
            console.log(videoUrl.toURL());
            setMedia({ type: 'video', url: videoUrl.toURL() });
          })
          .catch((error) => {
            console.log('Upload error:', error);
          });
      } else if (fileExtension === 'gif') {
        // Handle GIF upload using Cloudinary API
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
            console.log('Response data:', data);
            const gifUrl = cld.image(data.public_id);
            console.log(gifUrl.toURL());
            setMedia({ type: 'gif', url: gifUrl.toURL() });
          })
          .catch((error) => {
            console.log('Upload error:', error);
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
                    const imageUrl = cld.image(data.public_id);
                    console.log(imageUrl.toURL());
                    setMedia({ type: 'image', url: imageUrl.toURL() });
                  })
                  .catch((error) => {
                    console.log('Upload error:', error);
                  });
              };
              reader.readAsDataURL(resizedImage);
            } else {
              console.log('Invalid resized image type:', typeof resizedImage);
            }
          },
          'blob'
        );
      }
    }
  }
  
  

  function sendPostHandler(event: FormEvent) {
    event.preventDefault();

    if (!messageInputRef.current) {
      return;
    }

    const enteredMessage = messageInputRef.current.value;

    if (!enteredMessage || enteredMessage.trim() === '') {
      return;
    }

    props.onAddPost({
      message: enteredMessage,
      name: props.name,
      userImage: props.userImage,
      image: media,
    });

    messageInputRef.current.value = '';
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <form onSubmit={sendPostHandler}>
      <div className={classes.container}>
        <textarea placeholder="How do you feel today?" id="post" rows={5} ref={messageInputRef}></textarea>
        <div className={classes.buttons}>
          <input type="file" name="file" ref={fileInputRef} onChange={addMediaHandler}></input>
          <button>Add post</button>
        </div>
        {media && (
          <div className={classes.mediaPreview}>
            {media.type === 'image' && <img src={media.url} alt="Post Media" />}
            {media.type === 'video' && (
              <video controls>
                <source src={media.url} type="video/mp4" />
              </video>
            )}
            {media.type === 'gif' && <img src={media.url} alt="Post Media" />}
          </div>
        )}
      </div>
    </form>
  );
}

export default NewPost;
