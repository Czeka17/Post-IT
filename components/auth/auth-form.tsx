import React from "react";
import classes from "./auth-form.module.css";

interface AuthFormProps {
	isLogin: boolean;
	switchAuthModeHandler: () => void;
	submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
	emailInputRef: React.RefObject<HTMLInputElement>;
	nameInputRef: React.RefObject<HTMLInputElement>;
	passwordInputRef: React.RefObject<HTMLInputElement>;
  }

function AuthForm({isLogin,
	switchAuthModeHandler,
	submitHandler,
	emailInputRef,
	nameInputRef,
	passwordInputRef,}:AuthFormProps) {

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
		</section>
	);
}
export default AuthForm;
