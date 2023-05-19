import classes from './post-item.module.css'
import Image from 'next/image';
import Comments from './comments';
import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
function PostItem(props){
    const commentInputRef = useRef()
    const { data: session, status } = useSession()
    const [comments,setComments] = useState([])
    const [showComments, setShowComments] = useState(false);
    const user = session.user.name
    function sendCommentHandler(event){
        event.preventDefault();

        const enteredComment = commentInputRef.current.value

        if(!enteredComment || enteredComment.trim() === ''){
            return
        }
        props.onAddComment({
            message: enteredComment,
            username: user,
            postId: props.id
        })

        commentInputRef.current.value = '';
    }

    function hideCommentsHandler(){
        setShowComments(false)
    }

    async function showCommentsHandler(event) {
        event.preventDefault();
      
        try {
          const response = await fetch('/api/posts/getComments', {
            method: 'POST',
            body: JSON.stringify({ postId: props.id }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data); // Log the response data
            const comments = data.commentList;
            setComments(comments);
            setShowComments(true);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong!');
          }
        } catch (error) {
          // Handle error
          console.error(error);
        }
      }
      
      const deleteCommentHandler = async (commentId) => {
        try {
          const response = await fetch('/api/posts/deleteComment', {
            method: 'DELETE',
            body: JSON.stringify({ postId: props.id, commentId }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            // Comment deleted successfully
            const data = await response.json();
            console.log(data);
            const comments = data.commentList;
            setComments(comments);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong!');
          }
        } catch (error) {
          // Handle error
          console.error(error);
        }
      };


      const createdAt = props.time;

      const createdDate = new Date(createdAt);

      const currentDate = new Date();
      const timeDiff = currentDate - createdDate

      const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let formattedTime = '';
if (days > 0) {
  formattedTime = `${days} day${days > 1 ? 's' : ''} ago`;
} else if (hours > 0) {
  formattedTime = `${hours} hour${hours > 1 ? 's' : ''} ago`;
} else if (minutes > 0) {
  formattedTime = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
} else {
  formattedTime = `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}
    return(
        <li className={classes.item}>
            <div>
                <div className={classes.content}>
                <div className={classes.profile}>
                        <img src={props.profile}/>
                        <div className={classes.postAuthor}>
                        <span>{props.author}</span>
                        <span className={classes.postDate}>{formattedTime}</span>
                        </div>
                    </div>
                    <p>{props.title}</p>
                    {props.image && <div className={classes.image}>
                        <Image src={props.image} alt={props.title} width={600} height={600} />
                    </div>}
                </div>
                <div className={classes.reaction}>
                    <div>
                        <p>Like</p>
                    </div>
                    <div>
                        {showComments ?<button onClick={hideCommentsHandler}>Hide Comments</button> : <button onClick={showCommentsHandler}>Show comments</button>}
                    </div>
                </div>
                <form className={classes.commentForm} onSubmit={sendCommentHandler}>
                    <textarea placeholder='comment' id='comment' ref={commentInputRef} rows='2'></textarea>
                    <button>Submit</button>
                </form>
                {showComments && (
          <Comments comments={comments} user={user} onDeleteComment={deleteCommentHandler} />
        )}
            </div>
        </li>
    )
}

export default PostItem;