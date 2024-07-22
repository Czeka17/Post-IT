import { useEffect, useState } from 'react';

interface Friend {
  _id: string;
  name: string;
  image: string;
}

const useFriendList = (username: string | null | undefined, friendName?:string ) => {
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFriend = friendList.some((friend) => friend.name === friendName);
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

  
  async function addUserHandler(username:string, friendname:string, userImage:string) {
      try {
        const response = await fetch('/api/user/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, friendname })
        });
        if (!response.ok) {
          throw new Error('Failed to add friend.');
        }
        const newUser: Friend = { _id: '', name: friendname, image: userImage };
        setFriendList((prevFriendList) => [...prevFriendList, newUser]);
        const data = await response.json();
        console.log(data); 
    
      } catch (error) {
        console.error(error);
      }
    };
    async function deleteUserHandler(username:string, friendname:string)  {
      try {
        const response = await fetch('/api/user/add-user', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, friendname})
        });
        if (!response.ok) {
          throw new Error('Failed to delete friend.');
        }
        setFriendList((prevFriendList) =>
          prevFriendList.filter((friend) => friend.name !== friendname)
        );
        const data = await response.json();
        console.log(data); 
    
      } catch (error) {
        console.error(error);
      }
    };



  return { friendList, isLoading, error, addUserHandler, deleteUserHandler, isFriend };
};

export default useFriendList;
