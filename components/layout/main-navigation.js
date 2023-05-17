import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import classes from './main-navigation.module.css'
function MainNavigation() {

    const { data: session, status, update } = useSession()
    function logoutHandler() {
      signOut();
    }
    

    
    return <header className={classes.header}>
        <Link href='/' >
            <div className={classes.logo}>PostIT</div>
        </Link>
        <nav>
           <ul>
            {session && <li><p>Signed in as {session.user.name}</p><Link href={session.user.name}><Image src={session.user.image} width={100} height={100}/></Link></li>}
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