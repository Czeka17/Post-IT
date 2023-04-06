import classes from './right-nav.module.css'
import Link from 'next/link';
function RightNav() {
    return <nav className={classes.navitems}>
        <ul>
            <li>
            <Link href='/'>Marketplace</Link>
            </li>
            <hr/>
            <li>
            <Link href='/'>Users</Link>
            </li>
            <hr/>
            <li>
            <Link href='/'>Forum</Link>
            </li>
            <hr/>
            <li>
            <Link href='/'>Profile</Link>
            </li>
            <hr/>
            <li>
            <Link href='/'>Settings</Link>
            </li>
            <hr/>
        </ul>
    </nav>
}

export default RightNav;