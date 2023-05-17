import classes from './right-nav.module.css'
import Link from 'next/link';

function RightNav() {
    return <nav className={classes.navitems}>
        <ul>
            <li>
            <Link href='/users' className={classes.btn}>Users</Link>
            </li>
            <li>
            <Link href='/' className={classes.btn}>Profile</Link>
            </li>
        </ul>
    </nav>
}

export default RightNav;