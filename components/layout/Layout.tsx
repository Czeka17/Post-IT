import { Fragment } from "react";
import MainNavigation from "./main-navigation";
import FriendList from "../friend-list/friend-list";
import { useSession, signOut } from "next-auth/react";
import { ReactNode } from "react";

type LayoutProps = {
	children: ReactNode;
};
function Layout(props: LayoutProps) {
	const { data: session, status } = useSession()
    function logoutHandler() {
      signOut();
    }
    
	return (
		<Fragment>
			{session && (
				<div>
					<MainNavigation onLogOut={logoutHandler} session={session}/>
					<FriendList />
				</div>
			)}
			<main>{props.children}</main>
		</Fragment>
	);
}

export default Layout;
