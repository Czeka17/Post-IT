import PostItem from "./post-item"
import classes from './posts-list.module.css'
import NewPost from "./add-post"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
function PostsList(props){

    const [posts, setPosts] = useState([])

    const { data: session, status } = useSession()

    const name = session.user.name

    useEffect(() => {
        fetch('/api/posts/addPost').then(response => response.json()).then((data) => {
            setPosts(data.posts);
        })
    }, [])


function addPostHandler(postData) {
    fetch('/api/posts/addPost', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(response => {
        if(response.ok){
            return response.json
        }
        return response.json().then(data => {
            throw new Error(data.message || 'Something went wrong!')
          })
    })
}
return <section>
    <div>
        <NewPost onAddPost={addPostHandler} name={name} userImage={session.user.image}/>
    </div>
    <ul className={classes.list}>
    {posts.map((post) =>(
        <PostItem key={post._id} id={post._id} title={post.message} image={post.image} author={post.name} profile={post.userImage} />
    ))}
</ul>
</section>
}

export default PostsList