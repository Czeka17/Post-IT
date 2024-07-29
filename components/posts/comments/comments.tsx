import classes from "./comments.module.css";
import { useSession } from "next-auth/react";
import UserComment from "./comment";
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
	likes: Like[];
}

interface CommentsProps {
	comments: Comment[];
	user: string;
	id: string;
	showCommentList: (comments: Comment[]) => void;
}
function Comments(props: CommentsProps) {

	if (props.comments?.length === 0) {
		return <p>No comments found</p>;
	}
	return (
		<div className={classes.comments}>
			<ul>
				{props.comments?.map((comment, key) => (
					<UserComment
					key={key}
						comment={comment}
						id={props.id}
					/>
				))}
			</ul>
		</div>
	);
}

export default Comments;
