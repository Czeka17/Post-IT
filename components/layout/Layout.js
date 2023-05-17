import { Fragment } from "react";
import MainNavigation from "./main-navigation";
import RightNav from './right-nav'
import FriendList from "../friend-list/friend-list";
import { useSession } from "next-auth/react";
function Layout(props) {
	const { data: session, status } = useSession()
	return (
		<Fragment>
			{ session && <div>
				<MainNavigation />
			<RightNav />
			<FriendList /></div>}
			<main>{props.children}</main>
		</Fragment>
	);
}

export default Layout;
