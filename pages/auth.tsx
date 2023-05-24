import AuthForm from '../components/auth/auth-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import classes from './auth.module.css'
function AuthPage() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      getSession().then(session => {
        if(session) {
          router.replace('/')
        } else {
          setIsLoading(false)
        }
      })
    }, [router]);
  
    if(isLoading) {
      return <div className={classes.loading}>
        <p>POST<span>IT</span></p>
      </div>
    }
  
    return <>
    <AuthForm />
    </>
}

export default AuthPage;