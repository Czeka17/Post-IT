
import classes from './user-profile.module.css';
import { Cloudinary } from '@cloudinary/url-gen';
import React, {useState, useEffect} from 'react';
import FileResizer from 'react-image-file-resizer';
import PostItem from '../posts/post-item';
import User from '../users/user';
import {FaUserFriends} from 'react-icons/fa'
import {HiOutlineClipboardList} from 'react-icons/hi'
import InfiniteScroll from 'react-infinite-scroll-component';
import usePosts from '../../hooks/usePosts';

const cloudName = 'dmn5oy2qa';

const cld = new Cloudinary({ cloud: { cloudName: cloudName } });


interface Friend{
  _id: string,
  name: string,
  image: string
}
interface Like {
  likedBy: string;
}
interface Post {
  _id: string;
  message: string;
  image: {
    url: string | undefined,
    type: 'image' | 'video' | 'gif' | undefined
  };
  name: string;
  userImage: string;
  createdAt: string;
  commentList: Comment[];
  likes: Like[]
}


interface Comment {
  _id: string;
  userId: string;
  message: string;
  userImg:string;
  userName:string;
  createdAt: string;
  likes: Like[];
}

interface UserProfileProps {
    image:string;
    username: string;
    activeUser?: string | null | undefined;
    onChangeProfile: (profile: { image: string; username: string }) => void;
  }
function UserProfile(props: UserProfileProps) {
  const {posts,fetchPosts,fetchMoreData, isLoading,updatePost,addComment,deletePost,hasMore} = usePosts()
  const [showPosts, setShowPosts] = useState(true)
  const [friendList, setFriendList] = useState<Friend[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  useEffect(() => {
    fetchPosts();
  }, [props.username]);

  function ShowFriendList(){
    setShowPosts(false)
  }
  function ShowPosts(){
    setShowPosts(true)
  }
  

  useEffect(() => {
    const fetchFriendList = async () => {
      const response = await fetch('/api/user/friend-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: props.username }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setFriendList(data.filteredFriendUsers);
      }
    };
  
    if (friendList.length === 0 || props.username !== friendList[0]?.name) {
      fetchFriendList();
    }
  }, [props.username, friendList]);


  function selectImageHandler(e:React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
        FileResizer.imageFileResizer(
          file,
          1000,
          1000,
          'PNG',
          100,
          0,
          (resizedImage) => {
            if(resizedImage instanceof File || resizedImage instanceof Blob){
            const reader = new FileReader();
            reader.onloadend = () => {
              const convertedFile = new File([resizedImage], file.name, {
                type: file.type,
                lastModified: file.lastModified,
              });
  
              const formData = new FormData();
              formData.append('file', convertedFile);
              formData.append('upload_preset', 'ewqicijo');
  
              fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  const imageUrl = cld.image(data.public_id);
                  console.log(imageUrl.toURL());
                  setSelectedImage(imageUrl.toURL())
                  props.onChangeProfile({
                    image: imageUrl.toURL(),
                    username: props.username,
                  });
                })
                .catch((error) => {
                  console.log('Upload error:', error);
                });
            };
            reader.readAsDataURL(resizedImage);
        }else{
            
        }
          },
          'blob'
        );
      }
    }



  useEffect(() => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('upload_preset', 'ewqicijo');

      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = cld.image(data.public_id);
          console.log(imageUrl.toURL());
          props.onChangeProfile({
            image: imageUrl.toURL(),
            username: props.username,
          });
        })
        .catch((error) => {
          console.log('Upload error:', error);
        });
    }
  }, [selectedImage]);


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
      <button onClick={ShowPosts}>
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
          <PostItem key={post._id} id={post._id} title={post.message} image={post.image} author={post.name} profile={post.userImage} time={post.createdAt} likes={post.likes} onAddComment={addComment} comments={post.commentList} onDeletePost={deletePost} onUpdatePost={updatePost}/>
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
