import classes from './add-post.module.css';
import { AiOutlineSend, AiFillFileAdd } from 'react-icons/ai';
import React,{ RefObject } from "react";
interface AddPostForm{
    onSendPost: (e: React.FormEvent<HTMLFormElement>) => void;
    placeholder: string;
    messageInputRef: RefObject<HTMLTextAreaElement>;
    isLoading: boolean;
    media: { type: 'image' | 'video' | 'gif'; url: string } | null;
    deleteMedia: () => void;
    children:React.ReactNode
}
function AddPostForm({onSendPost,placeholder,messageInputRef,media,deleteMedia,isLoading,children}:AddPostForm){
    return  <form onSubmit={onSendPost}>
    <div className={classes.container}>
      <div className={classes.textareaContainer}>
        <textarea
          placeholder={placeholder}
          id="post"
          rows={5}
          ref={messageInputRef}
        ></textarea>
        <button className={classes.submitButton}><AiOutlineSend /></button>
        <div className={classes.file}>
          <label htmlFor="file" className={classes.fileButton}>
            <AiFillFileAdd />
           {children}
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
      {isLoading && <div className={classes.loader}></div>}
    </div>
  </form>
}
export default AddPostForm;