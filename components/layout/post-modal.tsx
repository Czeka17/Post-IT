import classes from './post-modal.module.css'
import {useState} from 'react'
import CloudinaryUploader from '../posts/cloudinary-uploader';
import { AiOutlineSend, AiFillFileAdd } from 'react-icons/ai';
interface PostItemProps {
    id: string;
	title: string;
	image: {
		url: string | undefined;
		type: "image" | "video" | "gif" | undefined;
	};
    onHideModal: () => void;
    onUpdatePost: (postId: string, newTitle: string, newImage: { url: string | undefined, type: "image" | "video" | "gif" | undefined }) => void;
}


function PostModal(props: PostItemProps){
    const [inputValue, setInputValue] = useState(props.title);
    const [image, setImage] = useState(props.image)
    const [isLoading, setIsLoading] = useState(false)
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
      };
      function MediaLoaderShow(){
        setIsLoading(true)
      }
      function MediaLoaderHide(){
        setIsLoading(false)
      }
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          props.onHideModal();
        }
      };
      function handleImageUpload(media: { type: 'image' | 'video' | 'gif'; url: string }) {
        setImage(media);
      }
      function handleImageDelete() {
        setImage({ url: undefined, type: undefined });
      }

      function handleSubmit() {
        fetch('/api/posts/addPost', {
          method: 'PATCH',
          body: JSON.stringify({ message:inputValue, postId: props.id, image:image }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            props.onUpdatePost(props.id, inputValue, image);
            props.onHideModal();
          })
          .catch(error => {
            console.error(error);
          });
      }
return(
    <div className={classes.postModal} onClick={handleBackdropClick}>
        <div className={classes.postContent}>
        <textarea
          value={inputValue}
          onChange={handleChange}
        />
        <div className={classes.actions}>
        <button className={classes.file}>Add/Change file
        <div>
            <label htmlFor="file" className={classes.fileButton}>
              <AiFillFileAdd />
              <CloudinaryUploader onUpload={handleImageUpload} onLoading={MediaLoaderShow} onLoadingEnd={MediaLoaderHide} />
            </label>
          </div>
          </button>
        {props.image && <button className={classes.deleteButton} onClick={handleImageDelete}>Delete file</button>}
        </div>
        {isLoading && <div className={classes.loader}></div>}
        {image &&
					(image.type === "image" || image.type === "gif") ? (
						<div className={classes.videoContainer}>
							<img
								src={image.url}
								alt={props.title}
							/>
              <button onClick={handleImageDelete}>X</button>
						</div>
					) : (
						image &&
						image.type === "video" && (
							<div className={classes.videoContainer}> 
								{" "}
								<video
									controls
								>
									<source
										src={image.url}
										type='video/mp4'
									/>
									Your browser does not support the video tag.
								</video>
                                <button onClick={handleImageDelete}>X</button>
							</div>
						)
					)}
                    <button className={classes.closeButton} onClick={props.onHideModal}>X</button>
                    <div className={classes.submitContainer}>
                        <button className={classes.submitButton} onClick={handleSubmit}>Submit</button>
                    </div>
        </div>
    </div>
)
}
export default PostModal;