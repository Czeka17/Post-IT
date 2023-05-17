import { useEffect, useState } from "react";
import User from "./user";
import classes from './users-list.module.css'
import { useSession } from 'next-auth/react';
function UsersList(props){
    const { data: session, status } = useSession()
    const [friendList, setFriendList] = useState([])
    useEffect(() => {
        const fetchFriendList = async() => {
            const response = await fetch('/api/user/friend-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: session?.user?.name})
            })
            if (response.ok) {
                const data = await response.json();
                setFriendList(data.friendUsers);
              }
            };
        console.log(friendList)
            fetchFriendList();
    }, [])
    const [users,setUsers] = useState([])

    console.log(friendList)
    useEffect(() =>{
        fetch('/api/user/user').then(response => response.json()).then((data) => {
            setUsers(data.users)
        })
    }, [])
    return (
        <section>
            <div>
                <ul className={classes.userlist}>
                    {users.map((user) =>(
                        <User key={user._id} name={user.name} userImage={user.image} friendList={friendList} />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default UsersList