import FriendList from "../friend-list/friend-list"
import PostsList from "../posts/posts-list"
import classes from './Main.module.css'

function MainDisplay(props) {
    return <section className={classes.position}>        
        <PostsList />
    </section>
}

export default MainDisplay;