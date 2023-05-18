import classes from './comments.module.css'


function Comments(props) {

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
                {props.user === comment.user.name && <button onClick={() => props.onDeleteComment(comment._id)}>Delete</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

export default Comments;