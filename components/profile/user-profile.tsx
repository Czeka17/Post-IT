
import classes from './user-profile.module.css';

import { Cloudinary } from '@cloudinary/url-gen';
import React, {useState, useEffect} from 'react';
import FileResizer from 'react-image-file-resizer';
import PostItem from '../posts/post-item';
import User from '../users/user';
import {FaUserFriends} from 'react-icons/fa'
import {HiOutlineClipboardList} from 'react-icons/hi'
import InfiniteScroll from 'react-infinite-scroll-component';

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
  user: {
    name: string;
    image: string;
  };
  createdAt: string;
  likes: Like[]
}
interface UserProfileProps {
    image:string;
    username: string;
    activeUser?: string | null | undefined;
    onChangeProfile: (profile: { image: string; username: string }) => void;
  }
function UserProfile(props: UserProfileProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [showPosts, setShowPosts] = useState(true)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState<Friend[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setIsLoading(true);
    setHasMore(true);
  }, [props.username]);
  
  useEffect(() => {
    fetchPosts();
  }, [props.username]);
const fetchPosts = async () => {
  try {
    const response = await fetch(`/api/posts/addPost?author=${props.username}&page=${page}`);
    if (response.ok) {
      const data = await response.json();
      const newPosts = data.posts;
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        const filteredPosts = newPosts.filter((post: Post) => post.name.toLowerCase() === props.username.toLowerCase());
        if (page === 1) {
          setPosts(filteredPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...filteredPosts]);
        }
        setPage((prevPage) => prevPage + 1);
      }
    } else {
      throw new Error('Failed to fetch posts');
    }
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};
const fetchMoreData = () => {
  fetchPosts();
};
const deletePostHandler = (postId:string) => {
  setPosts((prevPosts) =>
    prevPosts.filter((post) => post._id !== postId)
  );
};
  function ShowFriendList(){
    setShowPosts(false)
  }
  function ShowPosts(){
    setShowPosts(true)
  }
  const updatePost = (postId: string, newTitle: string, newImage: { url: string | undefined, type: "image" | "video" | "gif" | undefined }) => {
    setPosts(prevPost => ({
      ...prevPost,
      title: newTitle,
      image: newImage
    }));
  };

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

function addCommentHandler(commentData:any){
    fetch('/api/posts/addComment', {
        method: 'POST',
        body: JSON.stringify(commentData),
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(response => {
        if(response.ok){
            return response.json()
        }
        return response.json().then(data => {
            throw new Error(data.message || 'Something went wrong!')
          })
    })
}
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
      <InfiniteScroll
                dataLength={posts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4 className={classes.loadingPosts}>Loading...</h4>}
                endMessage={<p className={classes.noMorePosts}>No more posts to load.</p>}
                style={{ overflow: 'visible',minWidth: '100%' }}
              >
        {showPosts && posts?.map((post) =>(
          <PostItem key={post._id} id={post._id} title={post.message} image={post.image} author={post.name} profile={post.userImage} time={post.createdAt} likes={post.likes} onAddComment={addCommentHandler} comments={post.commentList} onDeletePost={deletePostHandler} onUpdatePost={updatePost}/>
        ))}
        </InfiniteScroll>
      </ul>}
      <ul className={classes.friendList}>{!showPosts && friendList?.map((friend) =>(
        <User key={friend._id} name={friend.name} userImage={friend.image} friendList={friendList} />
      ))}</ul>
    </div>
    </section>
  );
}

export default UserProfile;
