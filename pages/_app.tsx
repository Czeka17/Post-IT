import '/styles/globals.css'
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../store/friends'
import Layout from '../components/layout/Layout';
export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps<{session: Session}>) {

  return (
      <SessionProvider session={session}>
        <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        </Provider>
      </SessionProvider>
  );
}
