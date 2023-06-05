import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import classes from './add-post.module.css';
import { Cloudinary } from '@cloudinary/url-gen';
import FileResizer from 'react-image-file-resizer';
import {FiDownload} from 'react-icons/fi'
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
  const [isLoading, setIsLoading] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function handleDragEnter(e:any) {
    e.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragOver(e:any) {
    e.preventDefault();
  }

  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  function deleteMedia(){
    setMedia(null)
  }
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
            const videoUrl = cld.video(data.public_id);
            console.log(videoUrl.toURL());
            setMedia({ type: 'video', url: videoUrl.toURL() });
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
            console.log('Response data:', data);
            const gifUrl = cld.image(data.public_id);
            console.log(gifUrl.toURL());
            setMedia({ type: 'gif', url: gifUrl.toURL() });
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
                    const imageUrl = cld.image(data.public_id);
                    console.log(imageUrl.toURL());
                    setMedia({ type: 'image', url: imageUrl.toURL() });
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
  
  function handleDrop(e: any) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const modifiedFile = new File([file], `file.${fileExtension}`, {
        type: file.type,
        lastModified: file.lastModified,
      });
  
      addMediaHandler({ target: { files: [modifiedFile] } } as unknown as ChangeEvent<HTMLInputElement>);
      setIsDraggingOver(false)
    }
  }
  

  function sendPostHandler(event: FormEvent) {

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
      <div className={classes.textareaContainer}>
          {isDraggingOver && (
            <div className={classes.dropIcon}>
              <FiDownload />
            </div>
          )}
          <textarea
            placeholder="How are you?"
            id="post"
            rows={5}
            ref={messageInputRef}
            onDrop={handleDrop}
            className={`${isDraggingOver ? classes.draggingOver : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          ></textarea>
        </div>
        {isLoading && <div className={classes.loadingContainer}><div className={classes.loader}>
    <div className={classes.bar1}></div>
    <div className={classes.bar2}></div>
    <div className={classes.bar3}></div>
    <div className={classes.bar4}></div>
    <div className={classes.bar5}></div>
    <div className={classes.bar6}></div>
    <div className={classes.bar7}></div>
    <div className={classes.bar8}></div>
    <div className={classes.bar9}></div>
    <div className={classes.bar10}></div>
    <div className={classes.bar11}></div>
    <div className={classes.bar12}></div>
</div> <p>loading file...</p></div> }
        <div className={classes.buttons}>
          <label htmlFor="file" className={classes.fileButton}>
            Add file
          <input type="file" name="file" ref={fileInputRef} onChange={addMediaHandler}className={classes.fileInput} ></input>
          </label>
          <button>Add post</button>
        </div>
        {media && media.type != null && (
          <div className={classes.mediaPreview}>
            {media.type === 'image' && <div><img src={media.url} alt="Post Media" /> <p onClick={deleteMedia}>X</p></div>}
            {media.type === 'video' && (
              <div><video controls>
              <source src={media.url} type="video/mp4" />
            </video><p onClick={deleteMedia}>X</p></div>
            )}
            {media.type === 'gif' && <img src={media.url} alt="Post Media" />}
          </div>
        )}
      </div>
    </form>
  );
}

export default NewPost;
