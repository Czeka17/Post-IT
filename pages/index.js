import { Fragment } from "react";
import MainDisplay from "../components/layout/Main";
import { getSession,useSession } from 'next-auth/react';
function HomePage() {

    const {data: session, status} = useSession()

    const name = session.user.name

    const DUMMY_POSTS = [
        {
            title:'Its my first post',
            author: `${name}`,
            image: '/images/dummy.png',
            id: 'p1',
            profile: '/images/dummy.png',
        },
        {
            title:'Its my second post',
            author: 'Jacob',
            image:'/images/icomo2.jpg',
            id: 'p2',
            profile: './images/dummy.png',
        },
        {
            title:'Its my Third post',
            author: 'Jacob',
            image:'/images/makeitmeme_xiQav.gif',
            id: 'p3',
            profile: './images/dummy.png',
        },
    ]

    const DUMMY_FRIENDS = [
        {
            name: 'Jan Dzban',
            picture: '/images/amogus.jpg',
            id: 'm1'
        },
        {
            name: 'Jan Dzban',
            picture: '/images/amogus.jpg',
            id: 'm2'
        },
        {
            name: 'Jan Dzban',
            picture: '/images/amogus.jpg',
            id: 'm3'
        },
    ]
return <Fragment>
    <MainDisplay posts={DUMMY_POSTS} friends={DUMMY_FRIENDS} />
</Fragment>
}


export async function getServerSideProps(context) {
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