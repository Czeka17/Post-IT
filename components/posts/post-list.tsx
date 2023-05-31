import PostItem from "./post-item"
import classes from './posts-list.module.css'
import NewPost from "./add-post"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import UsersList from "../users/users.list"
import {FaUserFriends} from 'react-icons/fa'
import {HiOutlineClipboardList} from 'react-icons/hi'
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

  interface Like {
    likedBy: string;
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
  interface PostData {
    message: string;
    name: string;
    userImage: string;
    image: {
      type: 'image' | 'video' | 'gif';
      url: string;
    } | null;
  }
  

  interface PostsListProps {}
function PostsList(props: PostsListProps){

    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { data: session, status } = useSession()
    const [showPosts, setShowPosts] = useState(true)
    const name = session?.user?.name || ''

    function ShowFriendList(){
        setShowPosts(false)
      }

      function ShowPosts(){
        setShowPosts(true)
      }

    useEffect(() => {
        fetch('/api/posts/addPost').then(response => response.json()).then((data) => {
            setPosts(data.posts);
            setIsLoading(false)
        })
    }, [])


function addPostHandler(postData:PostData) {
    fetch('/api/posts/addPost', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': 'application/json'
          }
    }).then((response) => {
        if(response.ok){
            return response.json()
        }
        return response.json().then(data => {
            throw new Error(data.message || 'Something went wrong!')
          })
    })
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


console.log(posts)
return <section className={classes.postContainer}>
    {isLoading ? <div className={classes.loading}><p>POST<span>IT</span></p></div> :<div>
    <div className={classes.display}>
        <button onClick={ShowPosts}><HiOutlineClipboardList/></button>
        <button onClick={ShowFriendList}><FaUserFriends /></button>
    </div>
   {showPosts && <div>
        <NewPost onAddPost={addPostHandler} name={name} userImage={session?.user?.image || ''}/>
    </div>}
    <ul className={classes.list}>
    {showPosts && posts.map((post) =>(
        <PostItem key={post._id} id={post._id} title={post.message} image={post?.image} author={post.name} profile={post.userImage} time={post.createdAt} likes={post.likes} onAddComment={addCommentHandler} comments={post.commentList}/>
    ))}
</ul>
{!showPosts && <UsersList />}
    </div>}
</section>
}

export default PostsList