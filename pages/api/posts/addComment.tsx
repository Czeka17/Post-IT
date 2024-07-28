import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";
async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method !== 'POST'){
        res.status(405).json({message: 'Method not allowed!'})
        return
    }
    const client = await connectToDatabase();
    try{
        const {postId,username, message} = req.body;

        const db = client.db();
        const objectId = new ObjectId(postId);

        const postsCollection = db.collection('posts');
        const post = await postsCollection.findOne({_id: objectId})

        const usersCollection = db.collection('users')
        const user = await usersCollection.findOne({name: username})

        if(!post){
            res.status(404).json({message: 'Post not found!'})
            client.close();
            return
        }
        if(!user){
            res.status(404).json({message: 'User not found!'})
            client.close();
            return
        }

        const userImg = user.image
        const userName = user.name
        const currentDate = new Date();
        const newComment = {
            _id: new ObjectId(),
            userName,
            userImg,
            message,
            createdAt: currentDate.toISOString(),
            likes: []
        }
        const commentList = post.commentList || []

        commentList.push(newComment);

        await postsCollection.updateOne(
            {_id: objectId},
            {$set: {commentList: commentList}}
        )
        res.status(200).json({ comment: newComment });

        client.close()
    }catch(error){
        console.error(error);
    res.status(500).json({ message: 'Internal1 Server Error' });
    }finally {
        if (client) {
          client.close();
        }
      }
}

export default handler;