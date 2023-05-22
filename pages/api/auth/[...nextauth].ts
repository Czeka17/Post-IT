import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";
export default NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            credentials: {
                name: { label: "Name", type: "name" },
        password: { label: "Password", type: "password" }
              },
            async authorize(credentials) {

                const client = await connectToDatabase();

                const usersCollection = client.db().collection('users');

                const user = await usersCollection.findOne({name: credentials!.name})


                if(!user){
                    throw new Error('No user found')
                }

                const isValid = await verifyPassword(credentials!.password, user.password)


                if(!isValid) {
                    client.close();
                    throw new Error('Could not log you in!')
                }
                
                client.close();
                const userid = new ObjectId(user._id)
                return{
                    id: userid.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            }
        })
    ],
    secret: `${process.env.AUTH_SECRET}`
})