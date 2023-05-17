import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const { username, friendname } = req.body;
    const client = await connectToDatabase();
    const db = client.db();

    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ name: username });
    const friend = await usersCollection.findOne({ name: friendname });

    if (!user) {
      res.status(404).json({ message: 'User not found!' });
      client.close();
      return;
    }

    if (!friend) {
      res.status(404).json({ message: 'Friend not found!' });
      client.close();
      return;
    }

    const friendName = friend.name;
    const friendlist = user.friendList;
    friendlist.push(friendName);

    await usersCollection.updateOne(
      { name: username },
      { $set: { friendList: friendlist } }
    );

    res.status(200).json({ message: 'Friend added successfully!' });

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal1 Server Error' });
  }
}

export default handler;
