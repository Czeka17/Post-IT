import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";

async function handler(req:NextApiRequest, res:NextApiResponse) {
  let client;

  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  if (req.method === "GET") {
    try {
      const db = client.db();
      const page = parseInt(req.query.page as string, 10) || 1; 
      const username = req.query.username
      const usersPerPage = 8;
      const skip = (page - 1) * usersPerPage;

      const users = await db
        .collection("users")
        .find({ name: { $ne: username } })
        .skip(skip)
        .limit(usersPerPage)
        .toArray();

      res.status(200).json({ users: users });
    } catch (error) {
      res.status(500).json({ message: "Getting users failed." });
    }
  }
    if (client) {
      client.close();
    }
}

export default handler;
