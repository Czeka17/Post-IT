import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from 'next-auth/react';
import Notification from "../layout/notification";
import AuthForm from "./auth-form";
import { createUser } from '../../lib/api';

function AuthFormContainer() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (requestStatus === 'success' || requestStatus === 'error') {
      const timer = setTimeout(() => {
        setRequestStatus(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestStatus('pending');

    if (isLogin) {
      const enteredPassword = passwordInputRef.current!.value;
      const enteredName = nameInputRef.current!.value;

      const result = await signIn('credentials', {
        redirect: false,
        name: enteredName,
        password: enteredPassword,
      });
      if (result && !result.error) {
        setRequestStatus('success');
        router.replace('/');
      } else {
        setRequestStatus('error');
      }
    } else {
      try {
        const enteredEmail = emailInputRef.current!.value;
        const enteredName = nameInputRef.current!.value;
        const enteredPassword = passwordInputRef.current!.value;

        const result = await createUser(enteredEmail, enteredName, enteredPassword);
        console.log(result);
        await signIn('credentials', {
          redirect: false,
          name: enteredName,
          password: enteredPassword,
        });
        setRequestStatus('success');
        router.replace('/');
      } catch (error) {
        setRequestStatus('error');
        console.log(error);
      }
    }
  }

  let notification: { status: string; title: string; message: string } | null = null;

  if (requestStatus === 'pending') {
    notification = {
      status: 'pending',
      title: 'Checking...',
      message: 'Checking credentials',
    };
  }

  if (requestStatus === 'success') {
    notification = {
      status: 'success',
      title: 'Success!',
      message: 'logged in successfully',
    };
  }
  if (requestStatus === 'error') {
    notification = {
      status: 'error',
      title: 'Error!',
      message: 'Invalid inputs!',
    };
  }

  return (
    <>
      <AuthForm
        isLogin={isLogin}
        switchAuthModeHandler={switchAuthModeHandler}
        submitHandler={submitHandler}
        emailInputRef={emailInputRef}
        nameInputRef={nameInputRef}
        passwordInputRef={passwordInputRef}
      />
      {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
    </>
  );
}

export default AuthFormContainer;
