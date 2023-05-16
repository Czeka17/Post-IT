import { useRef, useState } from 'react';
import classes from './add-post.module.css'
function NewPost(props) {
    const [image, setImage] = useState('');

    const messageInputRef = useRef()


    function addImageHandler(e){
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result)
            setImage(reader.result);
        }
    }

    function sendCommentHandler(event){
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


    return (<form onSubmit={sendCommentHandler}>
        <div className={classes.idk}>
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