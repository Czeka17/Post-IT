import FriendList from "../friend-list/friend-list"
import PostsList from "../posts/posts-list"
import classes from './Main.module.css'
import RightNav from "./right-nav";

function MainDisplay(props) {
    return <section className={classes.position}>
        <RightNav />
        <PostsList />
        <FriendList friends={props.friends} />
    </section>
}

export default MainDisplay;