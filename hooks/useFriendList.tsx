import { useEffect, useState } from 'react';

interface Friend {
  _id: string;
  name: string;
  image: string;
}

const useFriendList = (username: string | null | undefined) => {
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const response = await fetch('/api/user/friend-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch friend list.');
        }

        const data = await response.json();
        setFriendList(data.filteredFriendUsers);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (friendList.length === 0) {
      fetchFriendList();
    }
  }, [username, friendList.length]);

  const addFriend = (newFriend: Friend) => {
    setFriendList((prevFriendList) => [...prevFriendList, newFriend]);
  };

  const removeFriend = (friendId: string) => {
    setFriendList((prevFriendList) =>
      prevFriendList.filter((friend) => friend._id !== friendId)
    );
  };

  return { friendList, isLoading, error, addFriend, removeFriend };
};

export default useFriendList;
