import AuthForm from '../components/auth/auth-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import classes from './auth.module.css'
import Head from 'next/head';
function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      getSession().then(session => {
        if(session) {
          setIsLoading(true)
        } else {
          
        }
      })
    }, [router]);
  
    if(isLoading) {
      return <div className={classes.loading}>
        <Head>
        <title>Authentication</title>
        <meta name="description" content='Create free account and join PostIT today!' />
        <meta name='keywords' content='PostIT, Social media, upload photos, chat online'/>
        <meta name='author' content='Jakub Czekański' />
        </Head>
        <p>POST<span>IT</span></p>
      </div>
    }else{
      return <>
      <Head>
         <title>Authentication</title>
         <meta name="description" content='Create free account and join PostIT today!' />
         <meta name='keywords' content='PostIT, Social media, upload photos, chat online'/>
         <meta name='author' content='Jakub Czekański' />
         </Head>
     <AuthForm />
     </>
    }

}

export default AuthPage;