import classes from './user-profile.module.css'
import Image from 'next/image';
function UserProfile(props){
    return <div className={classes.profile}>
    <Image src={props.image} width={300} height={300} />
    <h2>{props.username}</h2>
</div>
}

export default UserProfile;