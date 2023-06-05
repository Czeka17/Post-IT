import { useEffect } from 'react';
import classes from './friend-list.module.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useFriendList from '../../hooks/useFriendList';
import { useDispatch, useSelector } from 'react-redux';
import { setFriendList } from '../../store/friends';
import { RootState } from '../../store/friends';

interface Friend {
  _id: string;
  name: string;
  image: string;
}

interface FriendListProps {}

function FriendList(props: FriendListProps) {
  const { data: session } = useSession();
  const friendList = useSelector((state: RootState) => state.friendList);
  const dispatch = useDispatch();

  const friends = useFriendList(session?.user?.name || '');

  useEffect(() => {
    dispatch(setFriendList(friends));
  }, [dispatch, friends]);

  return (
    <section className={classes.position}>
      {session && (
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
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default FriendList;
