import { useEffect, useState } from 'react';

const useFriendList = (username:string) => {
  const [friendList, setFriendList] = useState([]);
  useEffect(() => {
    const fetchFriendList = async() => {
        const response = await fetch('/api/user/friend-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username})
        })
        if (response.ok) {
            const data = await response.json();
            setFriendList(data.filteredFriendUsers);
          }
        };
        fetchFriendList();
}, [username])
 return friendList;
};

export default useFriendList;