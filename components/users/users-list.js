import { useEffect, useState } from "react";
import User from "./user";
import classes from "./users-list.module.css";
import { useSession } from "next-auth/react";

function UsersList() {
  const { data: session, status } = useSession();
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchFriendList = async () => {
      const response = await fetch("/api/user/friend-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: session?.user?.name }),
      });

      if (response.ok) {
        const data = await response.json();
        setFriendList(data.friendUsers);
        setIsLoading(false);
      }
    };

    fetchFriendList();
  }, [session?.user?.name]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`/api/user/user?page=${page}`);
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, ...data.users]);
    };

    fetchUsers();
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <section>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul className={classes.userlist}>
            {users.map((user) => (
              <User key={user._id} name={user.name} userImage={user.image} friendList={friendList} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default UsersList;
