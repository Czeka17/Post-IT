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
  function debounce(func: () => void, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  }
function UsersList() {
  const { data: session, status } = useSession();
  const [friendList, setFriendList] = useState<user[]>([]);
  const [users, setUsers] = useState<user[]>([]);
  const [page, setPage] = useState<number>(1);
  const listRef = useRef<HTMLUListElement>(null);

 if(session && session?.user?.name){
  const friends = useFriendList(session.user.name)
  useEffect(() =>
  setFriendList(friends)
  ,[friends])
 }
 
 const debouncedScrollHandler = useRef(
  debounce(() => {
    handleScroll();
  }, 500)
).current;

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
    window.addEventListener("scroll", debouncedScrollHandler);
    window.addEventListener("touchmove", debouncedScrollHandler);

    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
      window.removeEventListener("touchmove", debouncedScrollHandler);
    };
  }, [debouncedScrollHandler]);
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
