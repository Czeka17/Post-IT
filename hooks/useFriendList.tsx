import { useEffect, useState } from 'react';
interface Friend{
  name: string,
  _id: string,
  image: string
}
const useFriendList = (username:string) => {
  const [friendList, setFriendList] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriendList = async () => {
      const response = await fetch('/api/user/friend-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        setFriendList(data.filteredFriendUsers);
      }
    };

    if (friendList.length === 0) {
      fetchFriendList();
    }
  }, [username, friendList]);

  return friendList;
};

export default useFriendList;
