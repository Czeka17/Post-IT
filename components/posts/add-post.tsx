import {useRef, useState } from 'react';
import classes from './add-post.module.css';
import { AiOutlineSend, AiFillFileAdd } from 'react-icons/ai';
import CloudinaryUploader from './cloudinary-uploader';
import {FiDownload, FiLoader} from 'react-icons/fi'
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

  function deleteMedia() {
    setMedia(null);
  }

  function sendPostHandler() {
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
  }

  function handleUpload(media: { type: 'image' | 'video' | 'gif'; url: string }) {
    setMedia(media);
  }


  return (
    <form onSubmit={sendPostHandler}>
      <div className={classes.container}>
        <div className={classes.textareaContainer}>
          <textarea
            placeholder="How do you feel today?"
            id="post"
            rows={5}
            ref={messageInputRef}
          ></textarea>
          <button className={classes.submitButton}><AiOutlineSend /></button>
          <div className={classes.file}>
            <label htmlFor="file" className={classes.fileButton}>
              <AiFillFileAdd />
              <CloudinaryUploader onUpload={handleUpload} />
            </label>
          </div>
        </div>
        {media && media.type != null && (
          <div className={classes.mediaPreview}>
            {media.type === 'image' && (
              <div>
                <img src={media.url} alt="Post Media" />
                <p onClick={deleteMedia}>X</p>
              </div>
            )}
            {media.type === 'video' && (
              <div>
                <video controls>
                  <source src={media.url} type="video/mp4" />
                </video>
                <p onClick={deleteMedia}>X</p>
              </div>
            )}
            {media.type === 'gif' && <img src={media.url} alt="Post Media" />}
          </div>
        )}
      </div>
    </form>
  );
}

export default NewPost;
