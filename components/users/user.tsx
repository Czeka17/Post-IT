import Link from 'next/link';
import classes from './user.module.css'
import { useSession } from 'next-auth/react';
import {AiOutlineUserAdd,AiOutlineUserDelete} from 'react-icons/ai'
import useFriendList from '../../hooks/useFriendList';
import { useFriendStore } from '../../store/useFriendlistStore';

interface UserProps {
    name: string;
    friendList: Friend[];
    userImage: string;
    friend?:string
  }
  interface Friend {
    _id: string;
    name: string;
    image: string;
  }

function User(props:UserProps){
    const { data: session, status } = useSession()

    const name = session!.user!.name as string;
    const { addUserHandler,deleteUserHandler, isFriend } = useFriendStore((state) => ({
      addUserHandler: state.addUserHandler,
      deleteUserHandler: state.deleteUserHandler,
      isFriend:state.isFriend
    }));



    return <li className={classes.user}>
        <Link href={`/${encodeURIComponent(props.name)}`}>
        <div className={classes.userContent} >
        <img src={props.userImage} alt={props.name} />
        <span>{props.name}</span>
        </div>
        </Link>
        {props.friend !== 'yes' && <div className={`${isFriend(props.name) ? classes.isFriend : ''} ${classes.actions}`}>
        {isFriend(props.name) ? (
          <button onClick={() => deleteUserHandler(name, props.name)}><AiOutlineUserDelete/></button>
        ) : (
          <button onClick={() => addUserHandler(name, props.name,props.userImage)}><AiOutlineUserAdd/></button>
        )}
        </div>}
    </li>
}

export default User;