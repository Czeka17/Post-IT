import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1608365",
  key: "0b4db96a211280fa4ebb",
  secret: "8cd09ce3487f3c1cefb3",
  cluster: "eu",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const collection = db.collection("messages");

    const messages = await collection.find().toArray();

    res.status(200).json({ success: true, messages });
  } else if (req.method === "POST") {
    const { message, user, image } = req.body;

    const { db } = await connectToDatabase();
    const collection = db.collection("messages");

    const newMessage = {
      user: user,
      message: message,
      image: image,
      timestamp: Date.now(),
    };

    const result = await collection.insertOne(newMessage);

    const insertedMessage = {
      ...newMessage,
      id: result.insertedId.toString(), // Use the generated ObjectID as the id
    };
    // Trigger 'new-message' event using Pusher
    pusher.trigger("postIT", "new-message", insertedMessage);

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
};
