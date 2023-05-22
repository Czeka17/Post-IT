import Link from 'next/link';
import classes from './user.module.css'
import { useSession } from 'next-auth/react';
interface UserProps {
    name: string;
    friendList: { name: string }[];
    userImage: string;
  }
function User(props:UserProps){
    const { data: session, status } = useSession()

    const addUserHandler = async () => {
        try {
          const response = await fetch('/api/user/add-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: session?.user?.name, friendname: props.name })
          });
      
          if (!response.ok) {
            throw new Error('Failed to add user');
          }
      
          // Handle the response as needed
          const data = await response.json();
          console.log(data); 
      
        } catch (error) {
          console.error(error);
          // Handle the error condition appropriately
        }
      };
    const deleteUserHandler = async () => {
        try {
          const response = await fetch('/api/user/add-user', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: session?.user?.name, friendname: props.name })
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete user');
          }
      
          // Handle the response as needed
          const data = await response.json();
          console.log(data); // Log or further process the response data
      
        } catch (error) {
          console.error(error);
          // Handle the error condition appropriately
        }
      };
      
      const isFriend = props.friendList.some((friend) => friend.name === props.name);
    return <li className={classes.user}>
        <Link href={`/${encodeURIComponent(props.name)}`}>
        <div className={classes.user} >
        <h3>{props.name}</h3>
        </div>
        </Link>
        <div>
        <img src={props.userImage} alt={props.name} />
        </div>
        <div>
        {isFriend ? (
          <button onClick={deleteUserHandler}>Unfollow</button>
        ) : (
          <button onClick={addUserHandler}>Follow</button>
        )}
        </div>
    </li>
}

export default User;