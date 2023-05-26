import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  let client

  try {
    const { username } = req.body;
    client = await connectToDatabase();
    const db = client.db();

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ name: username });

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const friendList = user.friendList;

    const friendUsers = await usersCollection
      .find({ name: { $in: friendList } })
      .toArray();

    const filteredFriendUsers = friendUsers.filter(
      (friendUser) => friendUser.name !== username
    );

    res.status(200).json({ filteredFriendUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (client) {
      client.close();
    }
  }
}

export default handler;
