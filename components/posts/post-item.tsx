import classes from "./post-item.module.css";
import Comments from "./comments/comments";
import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineSend } from "react-icons/ai";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PostModal from "./post-modal";
import PostActions from "./post-actions";
import PostAuthor from "./post-author";

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
interface Like {
	likedBy: string;
}

interface PostItemProps {
	id: string;
	profile: string;
	author: string;
	title: string;
	image: {
		url: string | undefined;
		type: "image" | "video" | "gif" | undefined;
	};
	time: string;
	comments?: Comment[];
	likes: Like[];
	onAddComment: (comment: {
		message: string;
		username: string;
		postId: string;
	}) => void;
	onDeletePost: (postId: string) => void;
	onUpdatePost: (
		postId: string,
		newTitle: string,
		newImage: {
			url: string | undefined;
			type: "image" | "video" | "gif" | undefined;
		}
	) => void;
}
function PostItem(props: PostItemProps) {
	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const { data: session, status } = useSession();
	const [comments, setComments] = useState<Comment[]>(props.comments || []);
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
			user: {
				name: session?.user?.name || "",
				image: session?.user?.image || "",
			},
			_id: "",
			message: enteredComment,
			createdAt: "",
			likes: [],
		};

		setComments((prevComments) => [...prevComments, newComment]);
		props.onAddComment({
			message: enteredComment,
			username: user,
			postId: props.id,
		});

		commentInputRef.current.value = "";
	}

	function hideCommentsHandler() {
		setShowComments(false);
	}
	function showCommentList(comments: Comment[]) {
		setComments(comments);
		setShowComments(true);
	}

	const commentsLength = props.comments?.length ?? 0;

	const createdAt = props.time;

	const createdDate = new Date(createdAt);

	const currentDate = new Date();
	const timeDiff = currentDate.getTime() - createdDate.getTime();

	const seconds = Math.floor(timeDiff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	let formattedTime = "";
	if (days > 0) {
		formattedTime = `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (hours > 0) {
		formattedTime = `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (minutes > 0) {
		formattedTime = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else {
		formattedTime = `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
	}

	return (
		<li className={classes.item}>
			<div>
				<div className={classes.content}>
					<PostAuthor
						author={props.author}
						profile={props.profile}
						formattedTime={formattedTime}
						onDeletePost={props.onDeletePost}
						id={props.id}
						handleShowModal={handleShowModal}
					/>
					<p>{props.title}</p>
					{props.image &&
					(props.image.type === "image" || props.image.type === "gif") ? (
						<div className={classes.image}>
							<img
								src={props.image.url}
								alt={props.title}
							/>
						</div>
					) : (
						props.image &&
						props.image.type === "video" && (
							<div className={classes.image}>
								{" "}
								<video
									controls
									className={classes.video}
								>
									<source
										src={props.image.url}
										type='video/mp4'
									/>
									Your browser does not support the video tag.
								</video>
							</div>
						)
					)}
				</div>
				<PostActions
					id={props.id}
					likes={props.likes}
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
						comments={comments}
						user={user}
						id={props.id}
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
								image={props.image}
								title={props.title}
								id={props.id}
								onHideModal={handleHideModal}
								onUpdatePost={props.onUpdatePost}
							/>
						</CSSTransition>
					)}
				</div>
			</TransitionGroup>
		</li>
	);
}

export default PostItem;
