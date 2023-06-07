import PostItem from "./post-item"
import classes from './posts-list.module.css'
import NewPost from "./add-post"
import { useSession } from "next-auth/react"
import { useEffect, useState,useRef } from "react"
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
    message: string | undefined;
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
    const [currentPage, setCurrentPage] = useState(1);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const name = session?.user?.name || ''
    const updatePost = (postId: string, newTitle: string, newImage: { url: string | undefined, type: "image" | "video" | "gif" | undefined }) => {
      setPosts(prevPosts => {
        const postIndex = prevPosts.findIndex(post => post._id === postId);
        if (postIndex === -1) {
          return prevPosts;
        }
        
        const updatedPosts = [...prevPosts];
        updatedPosts[postIndex] = {
          ...updatedPosts[postIndex],
          message: newTitle,
          image: newImage
        };
    
        return updatedPosts;
      });
    };
    
    function ShowFriendList(){
        setShowPosts(false)
      }

      function ShowPosts(){
        setShowPosts(true)
      }
      function loadMorePosts() {
        setCurrentPage((prevPage) => prevPage + 1);
      }
      const deletePostHandler = (postId:string) => {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      };
    useEffect(() => {
        fetch(`/api/posts/addPost?page=${currentPage}`).then(response => response.json()).then((data) => {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
            setIsLoading(false)
        })
    }, [currentPage])

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadMorePosts();
          }
        },
        {
          rootMargin: '0px',
          threshold: 0.001,
        }
      );
    
      if (sentinelRef.current) {
        observer.observe(sentinelRef.current);
      }
    
      return () => {
        if (sentinelRef.current) {
          observer.unobserve(sentinelRef.current);
        }
      };
    }, []);

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
    }).then(() => {
      fetch(`/api/posts/addPost?page=${currentPage}`)
        .then((response) => response.json())
        .then((data) => {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
          setCurrentPage(1); 
        });
    })
    .catch((error) => {
      console.error(error);
    });
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

const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    setCurrentPage(prevPage => prevPage + 1);
  }
};

useEffect(() => {
  const handleScrollAndTouchMove = () => {
    handleScroll();
  };

  window.addEventListener('scroll', handleScrollAndTouchMove);
  window.addEventListener('touchmove', handleScrollAndTouchMove);

  return () => {
    window.removeEventListener('scroll', handleScrollAndTouchMove);
    window.removeEventListener('touchmove', handleScrollAndTouchMove);
  };
}, []);

if(isLoading){
  return <div className={classes.loading}><p>POST<span>IT</span></p></div>
}

return <section className={classes.postContainer}>
    <div>
    <div className={classes.display}>
        <button onClick={ShowPosts}>Posts <HiOutlineClipboardList/></button>
        <button onClick={ShowFriendList}>Users <FaUserFriends /></button>
    </div>
   {showPosts && <div>
        <NewPost onAddPost={addPostHandler} name={name} userImage={session?.user?.image || ''}/>
    </div>}
    <ul className={classes.list}>
    {showPosts && posts?.map((post) =>(
        <PostItem key={post._id} id={post._id} title={post.message} image={post?.image} author={post.name} profile={post.userImage} time={post.createdAt} likes={post.likes} onAddComment={addCommentHandler} comments={post.commentList} onDeletePost={deletePostHandler} onUpdatePost={updatePost}/>
    ))}
</ul>
{!showPosts && <UsersList />}
<div ref={sentinelRef} />
    </div>
</section>
}

export default PostsList