import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Friend {
  _id: string;
  name: string;
  image: string;
}

interface FriendStore {
  friendList: Friend[];
  isLoading: boolean;
  error: string | null;
  isFriend: (friendName?: string) => boolean;
  addUserHandler: (username: string, friendname: string, userImage: string) => Promise<void>;
  deleteUserHandler: (username: string, friendname: string) => Promise<void>;
  fetchFriendList: (username: string | null) => Promise<void>;
}
export const useFriendStore = create<FriendStore>()(
    devtools((set, get) => ({
      friendList: [],
      isLoading: true,
      error: null,
      
      isFriend: (friendName?: string) => {
        const { friendList } = get();
        return friendList.some((friend) => friend.name === friendName);
      },
  
      fetchFriendList: async (username: string | null) => {
        if (!username) return;
        set({ isLoading: true });
        try {
          const response = await fetch('/api/user/friend-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          });
          if (!response.ok) throw new Error('Failed to fetch friend list.');
          const data = await response.json();
          set({ friendList: data.filteredFriendUsers });
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
  
      addUserHandler: async (username: string, friendname: string, userImage: string) => {
        try {
          const response = await fetch('/api/user/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, friendname }),
          });
          if (!response.ok) throw new Error('Failed to add friend.');
          const newUser: Friend = { _id: '', name: friendname, image: userImage };
          set((state) => ({
            friendList: [...state.friendList, newUser],
          }));
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      },
  
      deleteUserHandler: async (username: string, friendname: string) => {
        try {
          const response = await fetch('/api/user/add-user', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, friendname }),
          });
          if (!response.ok) throw new Error('Failed to delete friend.');
          set((state) => ({
            friendList: state.friendList.filter((friend) => friend.name !== friendname),
          }));
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      },
    }))
  );