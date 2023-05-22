import { Fragment } from "react";
import MainDisplay from "../components/layout/Main";
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from "next";
function HomePage() {

   
return <Fragment>
    <MainDisplay />
</Fragment>
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