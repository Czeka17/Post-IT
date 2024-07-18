import classes from "./comments.module.css";
import { useSession } from "next-auth/react";
import UserComment from "./comment";
interface Like {
	likedBy: string;
}
interface Comment {
	userId: string;
	user: {
		name: string;
		image: string;
	};
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
	const { data: session, status } = useSession();

	const deleteCommentHandler = async (commentId: string) => {
		try {
			const response = await fetch("/api/posts/deleteComment", {
				method: "DELETE",
				body: JSON.stringify({
					postId: props.id,
					commentId,
					username: session?.user?.name,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				const comments = props.comments.filter(
					(comment) => comment._id !== commentId
				);
				props.showCommentList(comments);
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
					<UserComment
						comment={comment}
						id={props.id}
						deleteCommentHandler={deleteCommentHandler}
					/>
				))}
			</ul>
		</div>
	);
}

export default Comments;
