import classes from './post-item.module.css'
import Image from 'next/image';
import Comments from './comments';
import { useRef } from 'react';
import { useSession } from 'next-auth/react';
function PostItem(props){
    const commentInputRef = useRef()
    const { data: session, status } = useSession()

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
    }

    console.log(user)

    return(
        <li className={classes.item}>
            <div>
                <div className={classes.content}>
                <div className={classes.profile}>
                        <img src={props.profile}/>
                        <h3>{props.author}</h3>
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
                        <button>Show comments</button>
                    </div>
                </div>
                <form className={classes.commentForm} onSubmit={sendCommentHandler}>
                    <textarea placeholder='comment' id='comment' ref={commentInputRef}></textarea>
                    <button>Submit</button>
                </form>
                <Comments />
            </div>
        </li>
    )
}

export default PostItem;