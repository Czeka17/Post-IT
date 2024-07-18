import classes from './index.module.css'
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from "next";
import PostsList from "../components/posts/post-list";
import Head from 'next/head';
import ChatContainer from '../components/chat/chat-container';
function HomePage() {
return <section className={classes.position}>
   <Head>
        <title>Home</title>
        <meta name="description" content='Browse through posts of other users, chat live, add others to your friendlist!' />
        </Head>
    <PostsList />
        <ChatContainer />
</section>
}


export async function getServerSideProps(context:GetServerSidePropsContext) {
    const session = await getSession({req: context.req});
  
    if(!session){
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        }
      };
    }
  
    return {
      props: { session },
    };
  }
export default HomePage;