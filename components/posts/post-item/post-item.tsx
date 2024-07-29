import classes from "./post-item.module.css";
import Comments from "../comments/comments";
import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import PostActions from "../post-actions/post-actions";
import { formatDate } from "../../../lib/formatTime";
import PostAuthorContainer from "../post-author/post-author-container";
import CommentForm from "../comments/comment-form";
import PostModalContainer from "../post-modal/post-modal-container";
import PostImage from "../post-image/post-image";
import { usePostsStore } from "../../../store/usePostsStore";
interface Comment {
	userId: string;
	userImg: string;
	userName: string;
	_id: string;
	message: string;
	createdAt: string;
	likes: Like[];
}
interface Like {
	likedBy: string;
}

interface Post {
	_id: string;
	message: string;
	image: {
		url: string | undefined;
		type: "image" | "video" | "gif" | undefined;
	};
	name: string;
	userImage: string;
	createdAt: string;
	likes: Like[];
	commentList: Comment[];
}

interface PostItemProps {
	post: Post;
}
function PostItem(props: PostItemProps) {
	const {
		_id,
		message,
		image,
		name,
		userImage,
		createdAt,
		likes,
		commentList,
	} = props.post;

	const {  addComment } = usePostsStore(state => ({
		addComment:state.addComment
	  }));
	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const { data: session, status } = useSession();
	const [showComments, setShowComments] = useState(false);
	const [showModal, setShowModal] = useState(false);
	function handleShowModal() {
		setShowModal(true);
	}
	function handleHideModal() {
		setShowModal(false);
	}
	const user = session?.user?.name || "";

	function sendCommentHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const enteredComment = commentInputRef.current?.value;

		if (!enteredComment || enteredComment.trim() === "") {
			return;
		}

		addComment({
			message: enteredComment,
			username: user,
			postId: _id,
		});

		commentInputRef.current.value = "";
	}

	function hideCommentsHandler() {
		setShowComments(false);
	}
	function showCommentList() {
		setShowComments(true);
	}

	const commentsLength = commentList?.length ?? 0;

	return (
		<li className={classes.item} data-cy='post'>
			<div>
				<div className={classes.content}>
					<PostAuthorContainer
						author={name}
						profile={userImage}
						formattedTime={formatDate(createdAt)}
						id={_id}
						handleShowModal={handleShowModal}
					/>
					<p>{message}</p>
					<PostImage image={image} />
				</div>
				<PostActions
					id={_id}
					likes={likes}
					hideCommentsHandler={hideCommentsHandler}
					commentsLength={commentsLength}
					showCommentList={showCommentList}
					showComments={showComments}
				/>
				<CommentForm
					sendCommentHandler={sendCommentHandler}
					commentInputRef={commentInputRef}
				/>
				{showComments && (
					<Comments
						comments={commentList}
						user={user}
						id={_id}
						showCommentList={showCommentList}
					/>
				)}
			</div>
			<div>
				{showModal && (
					<PostModalContainer
						image={image}
						title={message}
						id={_id}
						onHideModal={handleHideModal}
					/>
				)}
			</div>
		</li>
	);
}

export default PostItem;
