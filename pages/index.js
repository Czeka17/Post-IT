import { Fragment } from "react";
import MainDisplay from "../components/layout/Main";
import { getSession,useSession } from 'next-auth/react';
function HomePage() {

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
    <MainDisplay friends={DUMMY_FRIENDS} />
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