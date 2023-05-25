import { useState, useEffect } from 'react';
import classes from './friend-list.module.css'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useFriendList from '../../hooks/useFriendList';
interface Friend{
    _id: string,
    name: string,
    image: string
}
interface FriendListProps {}
function FriendList(props: FriendListProps) {
const { data: session, status } = useSession()
const [friendList, setFriendList] = useState<Friend[]>([])

if(session && session.user?.name){
    const friends = useFriendList(session.user.name)
  useEffect(() =>
  setFriendList(friends)
  ,[friends])
}

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