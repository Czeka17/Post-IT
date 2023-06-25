import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

interface Like {
  likedBy: string;
}

interface Comment {
  _id: string;
  userId: string;
  message: string;
  createdAt: Date;
  likes: Like[];
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client;

  try {
    const { postId, commentId, username } = req.body;

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

      const commentIndex = post.commentList.findIndex(
        (item: Comment) => item._id.toString() === commentId
      );

      if (commentIndex === -1) {
        res.status(404).json({ message: "Comment not found!" });
        client.close();
        return;
      }

      const comment = post.commentList[commentIndex];

      const likedByUser = comment.likes.some(
        (item: Like) => item.likedBy === username
      );

      let updatedLikes: Like[];
      if (likedByUser) {
        updatedLikes = comment.likes.filter(
          (item: Like) => item.likedBy !== username
        );
      } else {
        updatedLikes = [...comment.likes, { likedBy: username }];
      }

      post.commentList[commentIndex].likes = updatedLikes;

      await postsCollection.updateOne(
        { _id: objectId },
        { $set: { commentList: post.commentList } }
      );

      res.status(200).json({ message: "Comment liked successfully!" });
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
