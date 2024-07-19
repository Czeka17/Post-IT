import React from "react";
import Link from "next/link";
import classes from './main-navigation.module.css'
import {FiLogOut} from 'react-icons/fi'
import { Session } from "next-auth";
interface MainNavigationProps{
    onLogOut:() => void;
    session: Session | null;
}
function MainNavigation({onLogOut,session}:MainNavigationProps) {
    
    return <header className={classes.header}>
        <Link href='/' >
            <div className={classes.logo}>Post<span>IT</span></div>
        </Link>
        <nav>
           <ul>
            {session?.user && <li><p>{session.user.name}</p><Link href={{ pathname: session.user.email }} passHref><img src={session.user.image  || '/default-image.jpg'} alt={session.user.name || 'profile picture'} /></Link></li>}
           {session && <li>
                <button className={classes.logout} onClick={onLogOut}>
                    <FiLogOut/>
                </button>
            </li>}
           </ul>
        </nav>
    </header>
}

export default MainNavigation;