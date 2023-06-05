import { useEffect, useState, useRef } from "react";
import User from "./user";
import classes from "./users-list.module.css";
import { useSession } from "next-auth/react";
import useFriendList from "../../hooks/useFriendList";
interface user {
    _id: string;
    name: string;
    image: string;
  }

function UsersList() {
  const { data: session, status } = useSession();
  const [friendList, setFriendList] = useState<user[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<user[]>([]);
  const [page, setPage] = useState<number>(1);
  const listRef = useRef<HTMLUListElement>(null);

 if(session && session?.user?.name){
  const friends = useFriendList(session.user.name)
  useEffect(() =>
  setFriendList(friends)
  ,[friends])
 }
 

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`/api/user/user?page=${page}&username=${session?.user?.name}`);
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, ...data.users]);
    };

    fetchUsers();
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } =
      (listRef.current as HTMLElement) || {};
  
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  


  useEffect(() => {
    const handleScrollAndTouchMove = () => {
      handleScroll();
    };

    window.addEventListener("scroll", handleScrollAndTouchMove);
    window.addEventListener("touchmove", handleScrollAndTouchMove);

    return () => {
      window.removeEventListener("scroll", handleScrollAndTouchMove);
      window.removeEventListener("touchmove", handleScrollAndTouchMove);
    };
  }, []);
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
