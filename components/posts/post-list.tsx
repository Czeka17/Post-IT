import PostItem from "./post-item";
import classes from "./posts-list.module.css";
import NewPost from "./addPost/add-post";
import { useSession } from "next-auth/react";
import { useEffect, useState} from "react";
import UsersList from "../users/users.list";
import { FaUserFriends } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import InfiniteScroll from "react-infinite-scroll-component";
import usePosts from '../../hooks/usePosts'

function PostsList() {
	const { posts, isLoading, hasMore, fetchMoreData, addPost, updatePost, deletePost, addComment } = usePosts();
	const { data: session, status } = useSession();
	const [showPosts, setShowPosts] = useState(true);
	const name = session?.user?.name || "";

	useEffect(() =>{
		console.log(posts)
	},[posts])
	function ShowFriendList() {
		setShowPosts(false);
	}
	function ShowPosts() {
		setShowPosts(true);
	}

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
					<button onClick={ShowPosts}>
						Posts <HiOutlineClipboardList />
					</button>
					<button onClick={ShowFriendList}>
						Users <FaUserFriends />
					</button>
				</div>
				{showPosts && (
					<div>
						<NewPost
							onAddPost={addPost}
						/>
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
											id={post._id}
											title={post.message}
											image={post?.image}
											author={post.name}
											profile={post.userImage}
											time={post.createdAt}
											likes={post.likes}
											onAddComment={addComment}
											comments={post.commentList}
											onDeletePost={deletePost}
											onUpdatePost={updatePost}
										/>
									</CSSTransition>
								))}
							</InfiniteScroll>
						</TransitionGroup>
					)}
				</ul>
				{!showPosts && <UsersList />}
			</div>
		</section>
	);
}

export default PostsList;
