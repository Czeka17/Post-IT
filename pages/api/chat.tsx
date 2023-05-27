import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const collection = db.collection("messages");

    const messages = await collection.find().toArray();

    res.status(200).json({ success: true, messages });
  } else if (req.method === "POST") {
    const { message, username, userimage } = req.body;

    const { db } = await connectToDatabase();
    const collection = db.collection("messages");

      await collection.insertOne({
        user: username,
        message: message,
        image: userimage,
        timestamp: Date.now(),
      });

      res.status(200).json({ success: true });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
};
