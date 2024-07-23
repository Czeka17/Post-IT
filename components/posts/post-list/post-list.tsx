import PostItem from "../post-item/post-item";
import classes from "./posts-list.module.css";
import NewPost from "../add-post/add-post";
import UsersList from "../../users/users.list";
import { FaUserFriends } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePostsStore } from "../../../store/usePostsStore";
import { useEffect, useState } from "react";
import FeedbackModal from "../../layout/feedback-modal/feedback-modal";
function PostsList() {
	const [showPosts, setShowPosts] = useState(true);

	function ShowFriendList() {
		setShowPosts(false);
	}
	function ShowPostsList() {
		setShowPosts(true);
	}
	const { posts, isLoading, initializePosts, fetchMoreData, hasMore } =
		usePostsStore((state) => ({
			posts: state.posts,
			isLoading: state.isLoading,
			initializePosts: state.initializePosts,
			fetchMoreData: state.fetchMoreData,
			hasMore: state.hasMore,
		}));
	useEffect(() => {
		initializePosts();
	}, [initializePosts]);
	if (isLoading) {
		return (
			<div className={classes.loading}>
				<p>
					POST<span>IT</span>
				</p>
			</div>
		);
	}

	return (
		<section className={classes.postContainer}>
			<div>
				<div className={classes.display}>
					<button onClick={ShowPostsList}>
						Posts <HiOutlineClipboardList />
					</button>
					<button onClick={ShowFriendList}>
						Users <FaUserFriends />
					</button>
				</div>
				{showPosts && (
					<div>
						<NewPost />
					</div>
				)}
				<ul className={classes.list}>
					{showPosts && (
						<TransitionGroup
							component='div'
							style={{ width: "100%" }}
						>
							<InfiniteScroll
								dataLength={posts.length}
								next={fetchMoreData}
								hasMore={hasMore}
								loader={<h4 className={classes.loadingPosts}>Loading...</h4>}
								endMessage={
									<p className={classes.noMorePosts}>No more posts to load.</p>
								}
								style={{ overflow: "visible", minWidth: "100%" }}
							>
								{posts?.map((post) => (
									<CSSTransition
										key={post._id}
										classNames={{
											enter: classes.postanimationEnter,
											enterActive: classes.postanimationEnterActive,
											exit: classes.postanimationExit,
											exitActive: classes.postanimationExitActive,
										}}
										timeout={300}
									>
										<PostItem
											key={post._id}
											post={post}
										/>
									</CSSTransition>
								))}
							</InfiniteScroll>
						</TransitionGroup>
					)}
				</ul>
				{!showPosts && <UsersList />}
			</div>
			{<FeedbackModal />}
		</section>
	);
}

export default PostsList;
