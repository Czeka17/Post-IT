import Link from 'next/link';
import classes from './user.module.css'

function User(props){
    return <li>
        <Link href={`/${encodeURIComponent(props.name)}`} className={classes.user}>
        <div>
            <button>
                Follow
            </button>
        </div>
        <div className={classes.user} >
        <h3>{props.name}</h3>
        <img src={props.userImage} alt={props.name} />
        </div>
        </Link>
    </li>
}

export default User;