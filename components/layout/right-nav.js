import classes from './right-nav.module.css'
import Link from 'next/link';
import { useSession } from "next-auth/react";
function RightNav() {
    const { data: session, status } = useSession()
    return <nav className={classes.navitems}>
        {session && <ul>
            <li>
            <Link href='/' className={classes.btn}>Marketplace</Link>
            </li>
            <li>
            <Link href='/users' className={classes.btn}>Users</Link>
            </li>
            <li>
            <Link href='/' className={classes.btn}>Forum</Link>
            </li>
            <li>
            <Link href='/' className={classes.btn}>Profile</Link>
            </li>
            <li>
            <Link href='/' className={classes.btn}>Settings</Link>
            </li>
        </ul>}
    </nav>
}

export default RightNav;