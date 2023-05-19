import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

export default NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {

                const client = await connectToDatabase();

                const usersCollection = client.db().collection('users');

                const user = await usersCollection.findOne({name: credentials.name})


                if(!user){
                    throw new Error('No user found')
                }

                const isValid = await verifyPassword(credentials.password, user.password)


                if(!isValid) {
                    client.close();
                    throw new Error('Could not log you in!')
                }
                
                client.close();
                return{
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            }
        })
    ],
    secret: `${process.env.AUTH_SECRET}`
})