import React, { LegacyRef, useRef, useState, useEffect } from "react";
import classes from "./auth-form.module.css";
import { useRouter } from "next/router";
import { signIn } from 'next-auth/react';
import Notification from "../layout/notification";
async function createUser(email:string,name:string,password:string){
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify({email, name, password}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	
	const data = await response.json();

	if(!response.ok){
		throw new Error(data.message || 'Something went wrong!')
	}

	return data;
}


function AuthForm() {

	const router = useRouter();
	const emailInputRef = useRef<HTMLInputElement | null>(null);
	const nameInputRef = useRef<HTMLInputElement | null>(null);
	const passwordInputRef = useRef<HTMLInputElement | null>(null);
    const [requestStatus, setRequestStatus] = useState<string | null>();
	const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if(requestStatus === 'success' || requestStatus === 'error'){
            const timer = setTimeout(() =>{
                setRequestStatus(null);
            }, 3000);
  
            return () => clearTimeout(timer);
        }
    }, [requestStatus])
	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}

	async function submitHandler(event:React.FormEvent<HTMLFormElement>){
		event.preventDefault();
        setRequestStatus('pending')

		if(isLogin){
			const enteredPassword = passwordInputRef.current!.value;
			const enteredName = nameInputRef.current!.value;

			const result = await signIn('credentials', {redirect: false,
			name: enteredName,
			password: enteredPassword,
		})
		if (result && !result.error){
            setRequestStatus('success')
			router.replace('/')
		}else{
            setRequestStatus('error')
        }
		} else{
			try{
				const enteredEmail = emailInputRef.current!.value;
				const enteredName = nameInputRef.current!.value;
				const enteredPassword = passwordInputRef.current!.value;
		

				const result = await createUser(enteredEmail, enteredName, enteredPassword)
				console.log(result)
				await signIn('credentials', {
                  redirect: false,
                  name: enteredName,
                  password: enteredPassword,
                });
                setRequestStatus('success')
				router.replace('/');
			}
			catch(error){
                setRequestStatus('error')
				console.log(error)
			}
		}

	}

    let notification: { status: string; title: string; message: string } | null = null;

    if(requestStatus === 'pending'){
      notification = {
          status: 'pending',
          title: 'Checking...',
          message: 'Checking credentials'
      }
  }
  
  if(requestStatus === 'success') {
      notification = {
          status: 'success',
          title: 'Success!',
          message: 'logged in successfully'
      }
  }
  if(requestStatus === 'error') {
      notification = {
          status: 'error',
          title: 'Error!',
          message: 'Invalid inputs!'
      }
  }


	return (
		<section className={classes.placing}>
			<section className={classes.introduction}>
				<h1>Welcome to PostIT</h1>
                <p>If you want to share posts with your friends then postIT is made special for you!</p>
                <p>Start now for free!</p>
			</section>
			<section className={classes.auth}>
				<h2>{isLogin ? "Log in" : "Sign up"}</h2>
				<form onSubmit={submitHandler}>
						<div className={classes.control}>
							<label htmlFor='name'>Name</label>
							<input
								type='name'
								id='name'
								required
								ref={nameInputRef}
							/>
						</div>
					{!isLogin && (
						<div className={classes.control}>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							id='email'
							required
							ref={emailInputRef}
						/>
					</div>
					)}
					<div className={classes.control}>
						<label htmlFor='password'>Password</label>
						<input
							type='password'
							id='password'
							required
							ref={passwordInputRef}
						/>
					</div>
					<div className={classes.actions}>
						<button>{isLogin ? "Log in" : "Sign Up"}</button>
						<hr />
						<button
							className={classes.switch}
							onClick={switchAuthModeHandler}
						>
							{isLogin ? "Create new account" : "Login with existing account"}
						</button>
					</div>
					<div>
						<p>Name: test</p>
						<p>Password: test123</p>
					</div>
				</form>
			</section>
           {notification &&  <Notification status={notification.status} title={notification.title} message={notification.message}/>}
		</section>
	);
}
export default AuthForm;
