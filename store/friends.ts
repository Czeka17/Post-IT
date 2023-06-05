import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';

interface Friend {
  _id: string;
  name: string;
  image: string;
}

interface RootState {
  friendList: Friend[];
}

const initialState: RootState = {
  friendList: [],
};

const friendSlice = createSlice({
  name: 'friendList',
  initialState,
  reducers: {
    setFriendList: (state, action: PayloadAction<Friend[]>) => {
      state.friendList = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friendList.push(action.payload);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friendList = state.friendList.filter(
        (friend) => friend.name !== action.payload
      );
    },
  },
});

export const { setFriendList, addFriend, removeFriend } = friendSlice.actions;

const store = configureStore({
  reducer: friendSlice.reducer,
});

export default store;
export type { RootState };
