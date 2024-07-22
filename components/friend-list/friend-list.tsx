import classes from './friend-list.module.css';
import { useSession } from 'next-auth/react';
import useFriendList from '../../hooks/useFriendList';
import User from '../users/user';
interface Friend {
  _id: string;
  name: string;
  image: string;
}

function FriendList() {
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
              <User name={friend.name} userImage={friend.image} friendList={friendList} friend={"yes"}/>
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
