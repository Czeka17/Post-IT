import { useEffect, useState, useRef } from "react";

interface User {
  _id: string;
  name: string;
  image: string;
}

const useUsers = (username: string | null | undefined) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const debounce = (func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  };

  const debouncedScrollHandler = useRef(
    debounce(() => {
      handleScroll();
    }, 500)
  ).current;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/user?page=${page}&username=${username}`);
        const data = await response.json();
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch users");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, username]);

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

  return { users, listRef, isLoading, error };
};

export default useUsers;
