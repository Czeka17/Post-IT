
import Chat from "../chat/chat";
import PostsList from "../posts/post-list";
import classes from './Main.module.css'
import { useState } from "react";

function MainDisplay() {
    
    return <section className={classes.position}>        
        <PostsList />
        <Chat />
    </section>
}

export default MainDisplay;