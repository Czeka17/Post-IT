import { useEffect } from 'react';
import classes from './friend-list.module.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useFriendList from '../../hooks/useFriendList';

interface Friend {
  _id: string;
  name: string;
  image: string;
}

interface FriendListProps {}

function FriendList(props: FriendListProps) {
  const { data: session } = useSession();
  const { friendList, isLoading, error } = useFriendList(session?.user?.name || '');

  if (!session) {
    return <div>Please log in.</div>
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className={classes.position}>
      <div>
        <div>
          <h2>Friend List</h2>
        </div>
        <div>
          <ul className={classes.list}>
            {friendList.map((friend: Friend) => (
              <li key={friend._id}>
                <Link
                  href={`/${encodeURIComponent(friend.name)}`}
                  className={classes.userlist}
                >
                  <img src={friend.image} alt={friend.name} />
                  <p>{friend.name}</p>
                </Link>
              </li>
            ))}
            {friendList.length === 0 && (
              <p className={classes.friendListIsEmpty}>
                Your friend list is empty!
              </p>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default FriendList;
