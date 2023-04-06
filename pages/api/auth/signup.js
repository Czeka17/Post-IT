import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res){
    if(req.method === 'POST'){
        const data = req.body;

        const {email, name, password } = data

        if(
            !email || !email.includes("@") ||
            !name || name.trim() === '' ||
            !password || password.trim().length < 6
        ){
            res.status(422).json({message:'Invalid input - password should also be at least 6 characters long'})
            return;
        }

        const client = await connectToDatabase();

        const db = client.db();

        const existingUser = await db.collection('users').findOne({name: name})

        if(existingUser){
            res.status(422).json({message: 'User exists already!'})
            client.close()
            return;
        }

        const hashedPassword = await hashPassword(password)

        let image = '/images/dummy.png'

        const result = await db.collection("users").insertOne({
            name: name,
            email: email,
            password: hashedPassword,
            image: image
        });

        res.status(201).json({message: 'Created user!'});
        client.close()
    }
}

export default handler;