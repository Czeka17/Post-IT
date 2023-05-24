import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";

async function handler(req:NextApiRequest,res:NextApiResponse){

    let client;

    try{
        client = await connectToDatabase(); 
    } catch(error){
        res.status(500).json({ message: 'Connecting to the database failed!'});
        return
    }

    if (req.method === 'POST') {
        const {name, message, image} = req.body;

        if(
            !message || message.trim() === ''
        ){
            res.status(422).json({message: 'Invalid input.'});
            client.close();
            return
        }
        const currentDate = new Date();
        const newPost = {
            name,
            message,
            image,
            createdAt: currentDate.toISOString(),
        };

        let result;

        try{
            const db = client.db();

            const result = await db.collection('posts').insertOne(newPost)

            res.status(201).json({ message: 'Added post!', post: newPost})
            return result
        }catch(error){
            res.status(500).json({message: 'Insetring post failed!'})
        }
    }
    if (req.method === 'GET') {
        try {
          const db = client.db();
          let posts;
      
          if (req.query.author) {
            const author = req.query.author;
            posts = await db.collection('posts').find({ name: author }).sort({ createdAt: -1 }).toArray();
            for (const post of posts) {
              const user = await db.collection('users').findOne({ name: post.name });
              post.userImage = user?.image;
            }
          } else {
            posts = await db.collection('posts').find().sort({ createdAt: -1 }).toArray();
            for (const post of posts) {
              const user = await db.collection('users').findOne({ name: post.name });
              post.userImage = user?.image;
            }
          }
      
          res.status(200).json({ posts });
        } catch (error) {
          res.status(500).json({ message: 'Getting posts failed.' });
        }
      }
      
    if(req.method === 'DELETE'){
        const db = client.db();
        const {postId} = req.body;
        const objectId = new ObjectId(postId)
        const postsCollection = db.collection('posts');
        try {
            const result = await postsCollection.deleteOne({ _id: objectId });
            if (result.deletedCount === 0) {
              res.status(404).json({ message: "Post not found!" });
              client.close()
            } else {
              res.status(200).json({ message: "Post deleted successfully" });
              client.close()
            }
          } catch (error) {
            res.status(500).json({ message: "Error deleting post" });
            client.close()
          }

    }

    client.close();
}

export default handler;