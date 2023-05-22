
import PostsList from "../posts/post-list";
import classes from './Main.module.css'

function MainDisplay() {
    return <section className={classes.position}>        
        <PostsList />
    </section>
}

export default MainDisplay;