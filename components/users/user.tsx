import Link from 'next/link';
import classes from './user.module.css'
import { useSession } from 'next-auth/react';
import {useState, useEffect} from 'react'
interface UserProps {
    name: string;
    friendList: { name: string }[];
    userImage: string;
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
    const [newFriendList, setNewFriendList] = useState<user[]>([])
      
    useEffect(() =>{
      setNewFriendList([...props.friendList]);
    },[props.friendList])

    async function friendListHandler(){
      if(!session || !session.user){
        return
      }
      const name = session.user.name as string;
      if(newFriendList.map(friend => friend.name).includes(props.name)){
        const result = await deleteUserHandler(name, props.name)
        const friendToDelete = newFriendList.findIndex(friend => friend.name === props.name)
        const updatedFriendList = [...newFriendList.slice(0,friendToDelete), ...newFriendList.slice(friendToDelete + 1)]
        setNewFriendList(updatedFriendList)
        return result
      }else{
        const result = await addUserHandler(name, props.name)
        const newUser = { name: props.name };
        const updatedFriendList: {name:string}[] = [...newFriendList, newUser]
        setNewFriendList(updatedFriendList)
        return result;
      }
    }
      const isFriend = newFriendList.some((friend) => friend.name === props.name);
    return <li className={classes.user}>
        <Link href={`/${encodeURIComponent(props.name)}`}>
        <div className={classes.userContent} >
        <img src={props.userImage} alt={props.name} />
        <h3>{props.name}</h3>
        </div>
        </Link>
        <div>
        {isFriend ? (
          <button onClick={friendListHandler}>Unfollow</button>
        ) : (
          <button onClick={friendListHandler}>Follow</button>
        )}
        </div>
    </li>
}

export default User;