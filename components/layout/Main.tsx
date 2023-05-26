
import Chat from "../chat/chat";
import PostsList from "../posts/post-list";
import classes from './Main.module.css'


function MainDisplay() {
    return <section className={classes.position}>        
        <PostsList />
        <Chat />
    </section>
}

export default MainDisplay;