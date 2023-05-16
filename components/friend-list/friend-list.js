import { useState, useEffect } from 'react';
import classes from './friend-list.module.css'
import { useSession } from 'next-auth/react';
function FriendList() {
const { data: session, status } = useSession()
const [friendList, setFriendList] = useState([])

useEffect(() => {
    const fetchFriendList = async() => {
        const response = await fetch('/api/user/friend-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: session.user.name})
        })
        if (response.ok) {
            const data = await response.json();
            setFriendList(data.friendUsers);
          }
        };
    console.log(friendList)
        fetchFriendList();
}, [])
return (
    <section className={classes.position}>
        <div>
            <h2>Friend List</h2>
        </div>
        <div>
            <ul>
                {friendList.map((friend) => (
                    <li className={classes.list} key={friend.id}><img src={friend.image} /><p>{friend.name}</p></li>
                ))}
            </ul> 
        </div>
    </section>
)
}

export default FriendList;