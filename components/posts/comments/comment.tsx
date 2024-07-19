import classes from './comment.module.css'
import { useSession } from 'next-auth/react';
import {BsTrash3Fill} from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai';
import {useState} from 'react'
interface Like {
    likedBy: string;
  }
interface Comment {
    userId: string;
    userImg:string;
    userName:string;
    _id: string;
    message: string;
    createdAt: string;
    likes: Like[]
  }
  interface UserCommentProps{
    comment:Comment;
    deleteCommentHandler:(commentId:string) => void
    id:string;
  }

function UserComment({comment,deleteCommentHandler,id}:UserCommentProps){
    const [likesCount, setLikesCount] = useState(comment.likes?.length ?? 0);
    const { data: session, status } = useSession();
    const [isLikedByUser, setIsLikedByUser] = useState(comment.likes?.some((like) => like.likedBy === session?.user?.name));
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
        } else if (seconds>0){
          formattedTime = `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
        }else{
          formattedTime = 'Now'
        }
      
        return formattedTime;
      }

      const likeCommentHandler = async(commentId: string) =>{
        try{
          const response = await fetch("api/posts/commentLikes", {
            method:"POST",
            body: JSON.stringify({postId: id, commentId:commentId, username: session?.user?.name}),
            headers: {
              "Content-Type": "application/json",
            },
          })
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            if(isLikedByUser){
                setIsLikedByUser(false)
                setLikesCount((prevCount) => prevCount - 1);
            }else {
                setLikesCount((prevCount) => prevCount + 1);
                setIsLikedByUser(true);
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Something went wrong!");
          }
        }catch(error){
          console.error(error);
        }
      }
    return  <li key={comment.userId} className={classes.comment}>
    <div className={classes.userImageContainer}>
      <img className={classes.userImage} src={comment.userImg} alt={comment.userName}/>
    </div>
    <div>
      <div className={classes.commentContent}>
        <h4>{comment.userName}</h4>
        <p>{comment.message}</p>
      </div>
      <div className={classes.timestamp}>
<p>{formatCommentCreatedAt(comment.createdAt)}</p>
<button className={classes.commentLike} onClick={() =>likeCommentHandler(comment._id)}>Like <AiFillHeart className={`${
          isLikedByUser ? classes["liked"] : "disliked"
      } `} /> ({likesCount})</button>
</div>
      {session?.user?.name === comment.userName && <button className={classes.commentDelete} onClick={() => deleteCommentHandler(comment._id)}><BsTrash3Fill/></button>}
    </div>
  </li>
}
export default UserComment;