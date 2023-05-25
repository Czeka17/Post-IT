import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
interface Like {
    likedBy: string;
  }
async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client;

  try {
    const { postId, username } = req.body;

    if (req.method === "POST") {
      client = await connectToDatabase();
      const db = client.db();
      const postsCollection = db.collection("posts");
      const objectId = new ObjectId(postId);
      const post = await postsCollection.findOne({ _id: objectId });

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
        client.close();
        return;
      }

      const likedByUser = post.likes.some((item: Like) => item.likedBy === username);

      let updatedLikes: Like[];
      if (likedByUser) {
        updatedLikes = post.likes.filter((item: Like) => item.likedBy !== username);
      } else {
        updatedLikes = [...post.likes, { likedBy: username }];
      }

      await postsCollection.updateOne(
        { _id: objectId },
        { $set: { likes: updatedLikes } }
      );

      res.status(200).json({ message: "Post liked successfully!" });
    } else {
      res.status(405).json({ message: "Method not allowed!" });
    }
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