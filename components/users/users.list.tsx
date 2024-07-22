import User from "./user";
import classes from "./users-list.module.css";
import { useSession } from "next-auth/react";
import useFriendList from "../../hooks/useFriendList";
import useUsers from "../../hooks/useUsers";

function UsersList() {
  const { data: session, status } = useSession();
  const { friendList } = useFriendList(session?.user?.name);
  const { users, listRef, isLoading, error } = useUsers(session?.user?.name);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2 className={classes.listName}>User list</h2>
      <div>
        <ul className={classes.userlist} ref={listRef}>
          {users.map((user) => (
            <User key={user._id} name={user.name} userImage={user.image} friendList={friendList} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default UsersList;
