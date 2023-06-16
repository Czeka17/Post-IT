import { RootState, addFriend, removeFriend } from '../../store/friends';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import classes from './user.module.css'
import { useSession } from 'next-auth/react';
import {useState, useEffect} from 'react'
import {AiOutlineUserAdd,AiOutlineUserDelete} from 'react-icons/ai'

interface UserProps {
    name: string;
    friendList: Friend[];
    userImage: string;
  }
  interface Friend {
    _id: string;
    name: string;
    image: string;
  }
interface user {
  name: string;
}

  async function addUserHandler(username:string, friendname:string) {
    try {
      const response = await fetch('/api/user/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, friendname })
      });
      const data = await response.json();
      console.log(data); 
  
    } catch (error) {
      console.error(error);
    }
  };
  async function deleteUserHandler(username:string, friendname:string)  {
    try {
      const response = await fetch('/api/user/add-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, friendname})
      });
  
      const data = await response.json();
      console.log(data); 
  
    } catch (error) {
      console.error(error);
    }
  };
function User(props:UserProps){
    const { data: session, status } = useSession()
    const [newFriendList, setNewFriendList] = useState<Friend[]>(props.friendList);
    const dispatch = useDispatch();
    const friendList = useSelector((state: RootState) => state.friendList);

    useEffect(() =>{
      setNewFriendList([...props.friendList])
    },[])

    async function friendListHandler(){
      if(!session || !session.user){
        return
      }
      const name = session.user.name as string;
      if (newFriendList.map(friend => friend.name).includes(props.name)) {
        await deleteUserHandler(name, props.name);
        const updatedFriendList = newFriendList.filter(
          (friend) => friend.name !== props.name
        );
        setNewFriendList(updatedFriendList);
        dispatch(removeFriend(props.name));
      }else{
        await addUserHandler(name, props.name);
        const newUser: Friend = { _id: '', name: props.name, image: props.userImage };
        const updatedFriendList = [...newFriendList, newUser];
        setNewFriendList(updatedFriendList);
        dispatch(addFriend(newUser));
      }
    }
      const isFriend = newFriendList.some((friend) => friend.name === props.name);
    return <li className={classes.user}>
        <Link href={`/${encodeURIComponent(props.name)}`}>
        <div className={classes.userContent} >
        <img src={props.userImage} alt={props.name} />
        <span>{props.name}</span>
        </div>
        </Link>
        <div className={`${isFriend ? classes.isFriend : ''} ${classes.actions}`}>
        {isFriend ? (
          <button onClick={friendListHandler}><AiOutlineUserDelete/></button>
        ) : (
          <button onClick={friendListHandler}><AiOutlineUserAdd/></button>
        )}
        </div>
    </li>
}

export default User;