import { GetServerSidePropsContext } from "next";
import UserProfile from "../components/profile/user-profile";
import { connectToDatabase } from "../lib/db";
import { useSession,getSession } from "next-auth/react";
import classes from './[username].module.css'


interface ProfilePageProps {
    userData: {
      id: string;
      name: string;
      image: string;
      onChangeProfile: (image: string, username: string) => Promise<void>;
    };
  }
  function ProfilePage(props: ProfilePageProps) {
    const { data: session, status } = useSession();
    const activeUser = session?.user?.name;
    // const token = session?.accessToken;
    // console.log(token)

    async function changeProfileHandler(image:string, username:string){
        const response = await fetch('/api/user/changeImage', {
          method: 'POST',
          body: JSON.stringify({image, username}),
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`
          }
        });
      
        const data = await response.json();

      }
      

    return <section className={classes.wrapper}><UserProfile username={props.userData.name}  onChangeProfile={(profile: { image: string; username: string }) =>
      changeProfileHandler(profile.image, profile.username)
    } activeUser={activeUser} image={props.userData.image} />
    </section>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const username = context.query.username;
  const session = await getSession({req: context.req});

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
  
  if(!session){
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
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