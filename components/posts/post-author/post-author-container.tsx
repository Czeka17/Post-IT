import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import PostAuthor from "./post-author";
import { usePostsStore } from "../../../store/usePostsStore";
interface PostAuthorProps {
	author:string;
	profile:string;
	formattedTime: string;
	handleShowModal: () => void;
	id: string;
}
function PostAuthorContainer(props:PostAuthorProps) {
	const { deletePost } = usePostsStore(state => ({
		deletePost:state.deletePost
	  }));

	const [showOptions, setShowOptions] = useState(false);
	const { data: session, status } = useSession();

	const handleKebabMenuClick = () => {
		setShowOptions(prevShowOptions => !prevShowOptions);
	};
	const kebabMenuRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				kebabMenuRef.current &&
				!kebabMenuRef.current.contains(event.target as Node)
			) {
				setShowOptions(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	return (
		<PostAuthor name={session?.user?.name} onDeletePost={deletePost} kebabMenuRef={kebabMenuRef} handleKebabMenuClick={handleKebabMenuClick} profile={props.profile} author={props.author} formattedTime={props.formattedTime} showOptions={showOptions} handleShowModal={props.handleShowModal} id={props.id} />
	);
}
export default PostAuthorContainer;
