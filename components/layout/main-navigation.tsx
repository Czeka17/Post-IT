import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import classes from './main-navigation.module.css'
function MainNavigation() {

    const { data: session, status, update } = useSession()
    function logoutHandler() {
      signOut();
    }
    

    
    return <header className={classes.header}>
        <Link href='/' >
            <div className={classes.logo}>Post<span>IT</span></div>
        </Link>
        <nav>
           <ul>
            {session?.user && <li><p>{session.user.name}</p><Link href={{ pathname: session.user.name }} passHref><img src={session.user.image  || '/default-image.jpg'} alt={session.user.name || 'profile picture'} /></Link></li>}
           {session && <li>
                <button onClick={logoutHandler}>
                    Logout
                </button>
            </li>}
           </ul>
        </nav>
    </header>
}

export default MainNavigation;