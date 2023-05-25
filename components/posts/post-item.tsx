import classes from './post-item.module.css'
import Image from 'next/image';
import Comments from './comments';
import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AiOutlineSend, AiFillHeart } from "react-icons/ai";

interface Comment {
    userId: string;
    user: {
      name: string;
      image: string;
    };
    _id: string;
    message: string;
  }
  interface Like {
    likedBy: string;
  }
  
  interface PostItemProps {
    id: string;
    profile: string;
    author: string;
    title: string;
    image?: string;
    time: string;
    comments?: Comment[];
    likes: Like[]
    onAddComment: (comment: { message: string; username: string; postId: string }) => void;
  }
function PostItem(props: PostItemProps){
    const commentInputRef = useRef<HTMLTextAreaElement>(null)
    const { data: session, status } = useSession()
    const [comments,setComments] = useState<Comment[]>([])
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(props.likes.length);
    const user = session?.user?.name || ''
    function sendCommentHandler(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        const enteredComment = commentInputRef.current?.value

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

    async function likePostHandler(){
      try{
        const response = await fetch('/api/posts/postLikes',{
          method: 'POST',
          body: JSON.stringify({postId: props.id, username: session?.user?.name}),
          headers: {
            'Content-Type': 'application/json',
        }
        })
        if (response.ok) {
          const data = await response.json();
          if(isLikedByUser){
            setLikesCount((prevCount) => prevCount - 1);

          }else{
            setLikesCount((prevCount) => prevCount + 1);
          }
        }
      }catch(error){
        console.log(error)
      }
    }

    async function showCommentsHandler(event: React.MouseEvent<HTMLButtonElement>) {
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
            console.log(data);
            const comments = data.commentList;
            setComments(comments);
            setShowComments(true);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong!');
          }
        } catch (error) {
          console.error(error);
        }
      }
      
      const deleteCommentHandler = async (commentId:string) => {
        try {
          const response = await fetch('/api/posts/deleteComment', {
            method: 'DELETE',
            body: JSON.stringify({ postId: props.id, commentId }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            const comments = data.commentList;
            setComments(comments);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong!');
          }
        } catch (error) {
          console.error(error);
        }
      };
      const deletePostHandler = async (postId:string) => {
        try {
          const response = await fetch('/api/posts/addPost', {
            method: 'DELETE',
            body: JSON.stringify({postId}),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log(data);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong!');
          }
        } catch (error) {
          console.error(error);
        }
      };

      const commentsLength = props.comments?.length ?? 0;

      const createdAt = props.time;

      const createdDate = new Date(createdAt);

      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - createdDate.getTime()

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

const isLikedByUser = Array.isArray(props.likes) && props.likes.some(item => item.likedBy === user);

    return(
        <li className={classes.item}>
            <div>
                <div className={classes.content}>
                <div className={classes.profileContainer}>
                        <div className={classes.profile}>
                        <img src={props.profile}/>
                        <div className={classes.postAuthor}>
                        <span>{props.author}</span>
                        <span className={classes.postDate}>{formattedTime}</span>
                        </div>
                        </div>
                       {props.author === session?.user?.name && <div>
                          <button onClick={() => deletePostHandler(props.id)}>DELETE</button>
                          <p>Edit</p>
                        </div>}
                    </div>
                    <p>{props.title}</p>
                    {props.image && <div className={classes.image}>
                        <img src={props.image} alt={props.title} />
                    </div>}
                </div>
                <div className={classes.reaction}>
                    <div>
                        <p onClick={likePostHandler}><AiFillHeart className={`${classes['heart-icon']} ${isLikedByUser ? classes['liked'] : ''} `} />{likesCount}</p>
                    </div>
                    <div>
                        {showComments ?<button onClick={hideCommentsHandler}>Hide Comments</button> : <button onClick={showCommentsHandler}>Show comments ({commentsLength})</button>}
                    </div>
                </div>
                <form className={classes.commentForm} onSubmit={sendCommentHandler}>
                    <textarea placeholder='comment' id='comment' ref={commentInputRef} rows={2}></textarea>
                    <button><AiOutlineSend/></button>
                </form>
                {showComments && (
          <Comments comments={comments} user={user} onDeleteComment={deleteCommentHandler} />
        )}
            </div>
        </li>
    )
}

export default PostItem;