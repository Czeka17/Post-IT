import { useState, useEffect } from 'react';
import classes from './friend-list.module.css'
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Friend{
    _id: string,
    name: string,
    image: string
}
interface FriendListProps {}
function FriendList(props: FriendListProps) {
const { data: session, status } = useSession()
const [friendList, setFriendList] = useState<Friend[]>([])

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
                {friendList.map((friend: Friend) => (
                    <li key={friend._id}><Link href={`/${encodeURIComponent(friend.name)}`} className={classes.list}><img src={friend.image} /><p>{friend.name}</p></Link></li>
                ))}
            </ul> 
        </div>
        </div>}
    </section>
)
}

export default FriendList;