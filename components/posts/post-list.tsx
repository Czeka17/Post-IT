import PostItem from "./post-item";
import classes from "./posts-list.module.css";
import NewPost from "./add-post/add-post";
import UsersList from "../users/users.list";
import { FaUserFriends } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import InfiniteScroll from "react-infinite-scroll-component";
import usePosts from "../../hooks/usePosts";

function PostsList() {
	const {
		posts,
		isLoading,
		hasMore,
		fetchMoreData,
		showPosts,
		ShowPostsList,
		ShowFriendList,
	} = usePosts();

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
		</section>
	);
}

export default PostsList;
