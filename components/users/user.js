import Link from 'next/link';
import classes from './user.module.css'
import { useSession } from 'next-auth/react';
function User(props){
    const { data: session, status } = useSession()


    const addUserHandler = async () => {
        try {
          const response = await fetch('/api/user/add-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: session.user.name, friendname: props.name })
          });
      
          if (!response.ok) {
            throw new Error('Failed to add user');
          }
      
          // Handle the response as needed
          const data = await response.json();
          console.log(data); // Log or further process the response data
      
        } catch (error) {
          console.error(error);
          // Handle the error condition appropriately
        }
      };
      
    return <li>
        <Link href={`/${encodeURIComponent(props.name)}`} className={classes.user}>
        <div>
            <button onClick={addUserHandler}>
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