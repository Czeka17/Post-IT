import React,{ RefObject } from "react";
import classes from './comment.module.css'
import { AiOutlineSend } from "react-icons/ai";
interface CommentFormProps{
    sendCommentHandler: (event: React.FormEvent<HTMLFormElement>) => void;
    commentInputRef:RefObject<HTMLTextAreaElement>;
}
function CommentForm({sendCommentHandler,commentInputRef}:CommentFormProps){
    return <form
    className={classes.commentForm}
    onSubmit={sendCommentHandler}
>
    <textarea
        placeholder='comment'
        id='comment'
        ref={commentInputRef}
        rows={2}
    ></textarea>
    <button>
        <AiOutlineSend />
    </button>
</form>
}
export default CommentForm;