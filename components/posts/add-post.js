import { useRef, useState } from 'react';
import classes from './add-post.module.css'
import { Cloudinary } from '@cloudinary/url-gen';

import FileResizer from 'react-image-file-resizer';

const cloudName = 'dmn5oy2qa';

const cld = new Cloudinary({ cloud: { cloudName: cloudName } });

function NewPost(props) {
    const [image, setImage] = useState('');

    const messageInputRef = useRef()


    function addImageHandler(e) {
        const file = e.target.files[0];
    
        FileResizer.imageFileResizer(
          file,
          800,
          800,
          'PNG', 
          100, 
          0, 
          (resizedImage) => {
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
                  setImage(imageUrl.toURL())
                })
                .catch((error) => {
                  console.log('Upload error:', error);
                });
            };
            reader.readAsDataURL(resizedImage);
          },
          'blob' 
        );
      }

    function sendPostHandler(event){
        event.preventDefault();

        const enteredMessage = messageInputRef.current.value 

        if(!enteredMessage || enteredMessage.trim() === ''){
            return
        }

        props.onAddPost({
            message: enteredMessage,
            name: props.name,
            userImage: props.userImage,
            image: image
        })

        messageInputRef.current.value = ''
        setImage('')
    }


    return (<form onSubmit={sendPostHandler}>
        <div className={classes.container}>
            <textarea placeholder='How You feel today?' id="post" rows='5' ref={messageInputRef}></textarea>
            <div className={classes.button}>
            <input type="file" name="file" onChange={addImageHandler} ></input>
            <button>
                Add post
            </button>
            </div>
        </div>
    </form>)
}

export default NewPost;