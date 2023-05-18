import classes from './comments.module.css'


function Comments(props) {

    if (props.comments.length === 0) {
        return <p>No comments found</p>;
      }
    return (
      <div className={classes.comments}>
        <ul>
          {props.comments?.map((comment) => (
            <li key={comment.userId}>
              <div className={classes.comment}>
                <img src={comment.user.image}/>
                <div className={classes.commentContent}>
                  <h4>{comment.user.name}</h4>
                  <p>{comment.message}</p> {/* Access the 'message' property */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

export default Comments;