import { useState, useEffect } from 'react';
import classes from './friend-list.module.css'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
}, [friendList])
return (
    <section className={classes.position}>
        {session && <div>
        <div>
            <h2>Friend List</h2>
        </div>
        <div>
            <ul>
                {friendList.map((friend) => (
                    <li className={classes.list} key={friend._id}><Link href={`/${encodeURIComponent(friend.name)}`}><img src={friend.image} /><p>{friend.name}</p></Link></li>
                ))}
            </ul> 
        </div>
        </div>}
    </section>
)
}

export default FriendList;