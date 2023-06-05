import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export const { setFriendList } = friendSlice.actions;

const reducer = friendSlice.reducer;

const store = configureStore({
  reducer,
});

export default store;
export type { RootState };
