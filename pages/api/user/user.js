import { connectToDatabase } from "../../../lib/db";

async function handler(req,res){
    let client;

    try{
        client = await connectToDatabase(); 
    } catch(error){
        res.status(500).json({ message: 'Connecting to the database failed!'});
        return
    }
    if(req.method === 'GET'){
        try {
            const db = client.db();

            const users = await db.collection('users').find().toArray();

            res.status(200).json({users:users});
            return users;
        } catch(error){
            res.status(500).json({message: 'Getting users failed.'})
        }
    }

    client.close();

}

export default handler;