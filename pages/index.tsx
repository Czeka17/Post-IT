import classes from './index.module.css'
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from "next";
import PostsList from "../components/posts/post-list";
import Chat from "../components/chat/chat";
function HomePage() {
return <section className={classes.position}>
    <PostsList />
        <Chat />
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