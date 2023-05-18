import classes from './comments.module.css'


function Comments() {
    return <div className={classes.comments}>
    <ul>
        <li>
            <div className={classes.comment}>
                <img src='./images/dummy.png'/>
                <div className={classes.commentContent}>
                <h4>Ja</h4>
                <p>Dobre!</p>
                </div>
            </div>
        </li>
    </ul>
</div>
}

export default Comments;