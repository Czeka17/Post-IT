
import classes from './user-profile.module.css';

import { Cloudinary } from '@cloudinary/url-gen';
import React, {useState, useEffect} from 'react';

import FileResizer from 'react-image-file-resizer';
import PostItem from '../posts/post-item';
import User from '../users/user';
const cloudName = 'dmn5oy2qa';

const cld = new Cloudinary({ cloud: { cloudName: cloudName } });


interface Friend{
  _id: string,
  name: string,
  image: string
}
interface Post {
  _id: string;
  message: string;
  image: string;
  name: string;
  userImage: string;
  createdAt: string;
  commentList: Comment[];
}

interface Comment {
  _id: string;
  userId: string;
  message: string;
  user: {
    name: string;
    image: string;
  };
}
interface UserProfileProps {
    image: string;
    username: string;
    activeUser?: string | null | undefined;
    onChangeProfile: (profile: { image: string; username: string }) => void;
  }
function UserProfile(props: UserProfileProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPosts, setShowPosts] = useState(true)
  const [friendList, setFriendList] = useState<Friend[]>([])
  useEffect(() => {
    fetch(`/api/posts/addPost?author=${props.username}`).then(response => response.json()).then((data) => {
        setPosts(data.posts);
    })
    setIsLoading(false)
}, [props.username])

  function ShowFriendList(){
    setShowPosts(false)
  }
  function ShowPosts(){
    setShowPosts(true)
  }

  useEffect(() => {
    const fetchFriendList = async() => {
        const response = await fetch('/api/user/friend-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: props.username})
        })
        if (response.ok) {
            const data = await response.json();
            setFriendList(data.friendUsers);
          }
        };
        fetchFriendList();
}, [friendList])
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

  function submitHandler(event: React.FormEvent) {
    event.preventDefault();

  }

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

  return (
    <section className={classes.container}>
    <div className={classes.profile}>
      <img src={props.image} />
      {props.activeUser === props.username ? (
        <form onSubmit={submitHandler}>
          <input type="file" name="file" onChange={selectImageHandler} />
          <button>Change image</button>
        </form>
      ) : null}
      <h2>{props.username}</h2>
    </div>
    <div className={classes.buttons}>
      <button onClick={ShowPosts}>
      Posts
      </button>
      <button onClick={ShowFriendList}>
        Friends
      </button>
    </div>
    <div>
      {!isLoading && <ul className={classes.postsList}>
        {showPosts && posts?.map((post) =>(
          <PostItem key={post._id} id={post._id} title={post.message} image={post.image} author={post.name} profile={post.userImage} time={post.createdAt} onAddComment={addCommentHandler} comments={post.commentList}/>
        ))}
      </ul>}
      <ul className={classes.friendList}>{!showPosts && friendList?.map((friend) =>(
        <User key={friend._id} name={friend.name} userImage={friend.image} friendList={friendList} />
      ))}</ul>
      {!isLoading && posts.length === 0 && <p>This user dont have any posts!</p>}
    </div>
    </section>
  );
}

export default UserProfile;
