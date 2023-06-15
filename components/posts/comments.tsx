import classes from './comments.module.css'
import {BsTrash3Fill} from 'react-icons/bs'

interface Comment {
    userId: string;
    user: {
      name: string;
      image: string;
    };
    _id: string;
    message: string;
    createdAt: string;
  }

  interface CommentsProps {
    comments: Comment[];
    user: string;
    id: string;
    showCommentList: (comments:Comment[]) => void
  }
  function Comments(props: CommentsProps) {

    function formatCommentCreatedAt(createdAt: string): string {
      const createdDate = new Date(createdAt);
    
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - createdDate.getTime();
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
    
      let formattedTime = "";
      if (days > 0) {
        formattedTime = `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (hours > 0) {
        formattedTime = `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        formattedTime = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        formattedTime = `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
      }
    
      return formattedTime;
    }
    
    const deleteCommentHandler = async (commentId: string) => {
      try {
        const response = await fetch("/api/posts/deleteComment", {
          method: "DELETE",
          body: JSON.stringify({ postId: props.id, commentId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const comments = props.comments.filter(comment => comment._id !== commentId);
          props.showCommentList(comments)
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong!");
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (props.comments?.length === 0) {
      return <p>No comments found</p>;
    }
    return (
      <div className={classes.comments}>
        <ul>
          {props.comments?.map((comment) => (
            <li key={comment.userId} className={classes.comment}>
              <div className={classes.userImageContainer}>
                <img className={classes.userImage} src={comment.user.image} alt={comment.user.name}/>
              </div>
              <div>
                <div className={classes.commentContent}>
                  <h4>{comment.user.name}</h4>
                  <p>{comment.message}</p>
                </div>
                <div className={classes.timestamp}>
      <p>{formatCommentCreatedAt(comment.createdAt)}</p>
    </div>
                {props.user === comment.user.name && <button onClick={() => deleteCommentHandler(comment._id)}><BsTrash3Fill/></button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

export default Comments;