import { connectToDatabase } from "../../../lib/db";

async function handler(req,res){
    if(req.method !== 'POST'){
        return;
    }
    const {username, image} = req.body;

    const client = await connectToDatabase();
    const db = client.db()

    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({name: username})

    if(!user){
        res.status(404).json({message: 'User not found!'});
        client.close()
        return;
    }


    const result = await usersCollection.updateOne({name: username}, {$set: { image: image }})

    client.close();
    res.status(200).json({message: 'Image updated!'})
}

export default handler;