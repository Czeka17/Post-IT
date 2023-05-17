import { useRef, useState } from "react";
import classes from "./auth-form.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from 'next-auth/react';

async function createUser(email,name,password){
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
	const emailInputRef = useRef();
	const nameInputRef = useRef();
	const passwordInputRef = useRef();

	const [isLogin, setIsLogin] = useState(true);

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}

	async function submitHandler(event){
		event.preventDefault();

		if(isLogin){
			const enteredPassword = passwordInputRef.current.value;
			const enteredName = nameInputRef.current.value;

			const result = await signIn('credentials', {redirect: false,
			name: enteredName,
			password: enteredPassword,
		})
		if (!result.error){
			router.replace('/')
		}
		} else{
			try{
				const enteredEmail = emailInputRef.current.value;
				const enteredName = nameInputRef.current.value;
				const enteredPassword = passwordInputRef.current.value;
		

				const result = await createUser(enteredEmail, enteredName, enteredPassword)
				console.log(result)
			}
			catch(error){
				console.log(error)
			}
		}

	}


	return (
		<section className={classes.placing}>
			<section className={classes.introduction}>
                <Image src="/images/amogus.jpg" alt="logo" width={100} height={100}/>
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
				</form>
			</section>
		</section>
	);
}
export default AuthForm;
