import UserProfile from "../components/profile/user-profile";
import { connectToDatabase } from "../lib/db";
import { useSession } from "next-auth/react";

function ProfilePage(props) {
    const { data: session, status, update } = useSession()
    const activeUser = session?.user?.name
    const token = session?.accessToken;
    console.log(token)

    async function changeProfileHandler(image, username){
        const response = await fetch('/api/user/changeImage', {
          method: 'POST',
          body: JSON.stringify(image, username),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      
        const data = await response.json();

      }
      

    return <UserProfile username={props.userData.name} onChangeProfile={changeProfileHandler} activeUser={activeUser} image={props.userData.image} />
}

export async function getServerSideProps(context) {
  const username = context.query.username;

  const client = await connectToDatabase();
  const db = client.db();
  const usersCollection = db.collection('users');

  const selectedUser = await usersCollection.findOne({ name: username });

  client.close();

  if (!selectedUser) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      userData: {
        id: selectedUser._id.toString(),
        name: selectedUser.name,
        image: selectedUser.image,
      },
    },
  };
}
export default ProfilePage;