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
  }

  interface CommentsProps {
    comments: Comment[];
    user: string;
    onDeleteComment: (commentId: string) => void;
  }
  function Comments(props: CommentsProps) {
    if (props.comments?.length === 0) {
      return <p>No comments found</p>;
    }
    return (
      <div className={classes.comments}>
        <ul>
          {props.comments?.map((comment) => (
            <li key={comment.userId}>
              <div className={classes.comment}>
                <img src={comment.user.image} alt={comment.user.name}/>
                <div className={classes.commentContent}>
                  <h4>{comment.user.name}</h4>
                  <p>{comment.message}</p>
                </div>
                {props.user === comment.user.name && <button onClick={() => props.onDeleteComment(comment._id)}><BsTrash3Fill/></button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

export default Comments;