import { Fragment } from "react";
import MainNavigation from "./main-navigation";
import RightNav from './right-nav'
function Layout(props) {
	return (
		<Fragment>
			<MainNavigation />
			<RightNav />
			<main>{props.children}</main>
		</Fragment>
	);
}

export default Layout;
