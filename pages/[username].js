import UserProfile from "../components/profile/user-profile";
import { connectToDatabase } from "../lib/db";
function ProfilePage(props) {

    return <UserProfile username={props.userData.name} image={props.userData.image} />
}

export async function getStaticPaths() {
    const client = await connectToDatabase();

    const db = client.db();

    const usersCollection = db.collection('users');

    const users = await usersCollection.find().toArray();

    client.close();
    return{
        fallback:'blocking',
        paths: users.map(user => ({params: {username: user.name}}))
    }
}

export async function getStaticProps(context){

    const username = context.params.username;

    const client = await connectToDatabase();

    const db = client.db();

    const usersCollection = db.collection('users');

    const selectedUser = await usersCollection.findOne({ name: username})

    client.close();

    return{
        props: {
            userData: {
                id: selectedUser._id.toString(),
                name: selectedUser.name,
                image: selectedUser.image
            }
        }
    }
}
export default ProfilePage;