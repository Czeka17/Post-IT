import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";

interface Like{
  likedBy: string
}
interface Comment {
    userId: string;
    user: {
      name: string;
      image: string;
    };
    _id: string;
    message: string;
    createdAt: string;
    likes: Like[]
  }

async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed!" });
    return;
  }

  let client
  try {
    const { postId } = req.body;

    client = await connectToDatabase();
    const db = client.db();
    const objectId = new ObjectId(postId);

    const postsCollection = db.collection("posts");
    const post = await postsCollection.findOne({ _id: objectId });
    if (!post) {
      res.status(404).json({ message: "Post not found!" });
      client.close();
      return;
    }

    const commentList = post.commentList;

    const usersCollection = db.collection("users");
    const commentsWithUser = await Promise.all(
      commentList.map(async (comment:Comment) => {
        const userId = new ObjectId(comment.userId);
        const user = await usersCollection.findOne({ _id: userId });
        return {
          userId: comment.userId,
          _id: comment._id,
          message: comment.message,
          user: user ? { name: user.name, image: user.image } : null,
          createdAt: comment.createdAt,
          likes: comment.likes
        };
      })
    );

    res.status(200).json({ commentList: commentsWithUser });

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }finally {
    if (client) {
      client.close();
    }
  }
}

export default handler;