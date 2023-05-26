import '/styles/globals.css'
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import {ChatProvider} from '../store/chatContext'
export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps<{session: Session}>) {

  return (
      <SessionProvider session={session}>
        <Layout>
          <ChatProvider>
          <Component {...pageProps} />
          </ChatProvider>
        </Layout>
      </SessionProvider>
  );
}
