import { MongoClient } from "mongodb";

export async function connectToDatabase() {
    const client = await MongoClient.connect('mongodb+srv://jczekanski123:eu3DeA7zr0V2BKfW@postit.m9gzcu6.mongodb.net/auth?retryWrites=true&w=majority')

    return client;
}
