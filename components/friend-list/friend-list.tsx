import { useEffect } from 'react';
import classes from './friend-list.module.css';
import { useSession } from 'next-auth/react';
import User from '../users/user';
import {useFriendStore} from '../../store/useFriendlistStore'
interface Friend {
  _id: string;
  name: string;
  image: string;
}

function FriendList() {
  const { data: session } = useSession();
  const { friendList, isLoading, error, fetchFriendList } = useFriendStore((state) => ({
    friendList: state.friendList,
    isLoading: state.isLoading,
    error: state.error,
    fetchFriendList: state.fetchFriendList,
  }));

  useEffect(() => {
    if (session?.user?.name) {
      fetchFriendList(session.user.name);
    }
  }, [session?.user?.name, fetchFriendList]);

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
