import { connectToDatabase } from "../../../lib/db";

async function handler(req,res){

    let client;

    try{
        client = await connectToDatabase(); 
    } catch(error){
        res.status(500).json({ message: 'Connecting to the database failed!'});
        return
    }

    if (req.method === 'POST') {
        const {name, message, userImage, image} = req.body;

        if(
            !message || message.trim() === ''
        ){
            res.status(422).json({message: 'Invalid input.'});
            client.close();
            return
        }

        const newPost = {
            name,
            message,
            image
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
    if(req.method === 'GET'){
        try {
            const db = client.db();
            const posts = await db.collection('posts').find().sort().toArray();
            res.status(200).json({posts: posts});
            return posts;
        } catch(error){
            res.status(500).json({message: 'Getting posts failed.'})
        }
    }

    client.close();
}

export default handler;