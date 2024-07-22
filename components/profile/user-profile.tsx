
import classes from './user-profile.module.css';
import React from 'react';
import PostItem from '../posts/post-item';
import User from '../users/user';
import {FaUserFriends} from 'react-icons/fa'
import {HiOutlineClipboardList} from 'react-icons/hi'
import InfiniteScroll from 'react-infinite-scroll-component';
import usePosts from '../../hooks/usePosts';
import useFriendList from '../../hooks/useFriendList';
import useProfileImage from '../../hooks/useProfileImage'

interface UserProfileProps {
    image:string;
    username: string;
    activeUser?: string | null | undefined;
  }
function UserProfile(props: UserProfileProps) {
  const {posts,fetchMoreData, isLoading,hasMore, showPosts, ShowFriendList, ShowPostsList} = usePosts()
  const {friendList} = useFriendList(props.username)
  const { selectImageHandler } = useProfileImage(props.image, props.username);

if(isLoading){
  return <div className={classes.loading}><p>POST<span>IT</span></p></div>
}
  return (
    <section className={classes.container}>
     <div className={classes.profile}>
      <label htmlFor="imageInput">
        <img src={props.image} alt="Profile Image" />
      </label>
      {props.activeUser === props.username ? (
        <form>
          <input
            id="imageInput"
            type="file"
            name="file"
            onChange={selectImageHandler}
            style={{ display: 'none' }}
          />
        </form>
      ) : null}
      <h2>{props.username}</h2>
    </div>
    <div className={classes.actions}>
      <button onClick={ShowPostsList}>
      <HiOutlineClipboardList/>
      </button>
      <button onClick={ShowFriendList}>
        <FaUserFriends />
      </button>
    </div>
    <div>
      {!isLoading && <ul className={classes.postsList}>
      {showPosts && <InfiniteScroll
                dataLength={posts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4 className={classes.loadingPosts}>Loading...</h4>}
                endMessage={<p className={classes.noMorePosts}>No more posts to load.</p>}
                style={{ overflow: 'visible',minWidth: '100%' }}
              >
         {posts?.map((post) =>(
          <PostItem key={post._id} post={post} />
        ))}
        </InfiniteScroll>}
      </ul>}
      <ul className={classes.friendList}>{!showPosts && friendList?.map((friend) =>(
        <User key={friend._id} name={friend.name} userImage={friend.image} friendList={friendList} />
      ))}</ul>
    </div>
    </section>
  );
}

export default UserProfile;
