import classes from "./post-item.module.css";
import Comments from "./comments/comments";
import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineSend } from "react-icons/ai";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PostModal from "./post-modal";
import PostAuthor from "./post-author";
import PostActions from "./post-actions/post-actions";
import {formatDate} from '../../lib/formatTime'
interface Comment {
	userId: string;
	userImg:string;
    userName:string;
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
	post:Post
	onAddComment: (comment: {
		message: string;
		username: string;
		postId: string;
	}) => void;
	onDeletePost: (postId: string) => void;
}
function PostItem(props: PostItemProps) {
	const { _id, message, image, name, userImage, createdAt, likes, commentList } = props.post;
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

		const newComment: Comment = {
			userId: "",
			userName: session?.user?.name || "",
			userImg: session?.user?.image || "",
			_id: "",
			message: enteredComment,
			createdAt: "",
			likes: [],
		};

		props.onAddComment({
			message: enteredComment,
			username: user,
			postId:_id,
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
		<li className={classes.item}>
			<div>
				<div className={classes.content}>
					<PostAuthor
						author={name}
						profile={userImage}
						formattedTime={formatDate(createdAt)}
						onDeletePost={props.onDeletePost}
						id={_id}
						handleShowModal={handleShowModal}
					/>
					<p>{message}</p>
					{image &&
					(image.type === "image" || image.type === "gif") ? (
						<div className={classes.image}>
							<img
								src={image.url}
								alt={message}
							/>
						</div>
					) : (
						image &&
						image.type === "video" && (
							<div className={classes.image}>
								{" "}
								<video
									controls
									className={classes.video}
								>
									<source
										src={image.url}
										type='video/mp4'
									/>
									Your browser does not support the video tag.
								</video>
							</div>
						)
					)}
				</div>
				<PostActions
					id={_id}
					likes={likes}
					hideCommentsHandler={hideCommentsHandler}
					commentsLength={commentsLength}
					showCommentList={showCommentList}
					showComments={showComments}
				/>
				<form
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
				{showComments && (
					<Comments
						comments={commentList}
						user={user}
						id={_id}
						showCommentList={showCommentList}
					/>
				)}
			</div>
			<TransitionGroup>
				<div>
					{showModal && (
						<CSSTransition
							in={showModal}
							classNames={{
								enter: classes.modalanimationEnter,
								enterActive: classes.modalanimationEnterActive,
							}}
							timeout={300}
						>
							<PostModal
								image={image}
								title={message}
								id={_id}
								onHideModal={handleHideModal}
							/>
						</CSSTransition>
					)}
				</div>
			</TransitionGroup>
		</li>
	);
}

export default PostItem;
