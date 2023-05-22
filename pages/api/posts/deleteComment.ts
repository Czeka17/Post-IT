import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";
interface Comment {
    _id: string;

  }
async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== "DELETE") {
    res.status(405).json({ message: "Method not allowed!" });
    return;
  }

  try {
    const {postId, commentId } = req.body;

    const client = await connectToDatabase();
    const db = client.db();
    const objectId = new ObjectId(postId);

    const postsCollection = db.collection("posts");
    const post = await postsCollection.findOne({ _id: objectId });
    if (!post) {
      res.status(404).json({ message: "Post not found!" });
      client.close();
      return;
    }

    const updatedComments = post.commentList.filter(
      (comment:Comment) => comment._id.toString() !== commentId
    );


    await postsCollection.updateOne(
      { _id: objectId },
      { $set: { commentList: updatedComments } }
    );

    res.status(200).json({ message: "Comment deleted successfully" });

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default handler;
