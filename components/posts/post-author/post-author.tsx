import Link from "next/link";
import classes from "./post-author.module.css";
import { BsTrash } from "react-icons/bs";
import { GoKebabHorizontal } from "react-icons/go";
import { AiOutlineEdit } from "react-icons/ai";
interface PostAuthorProps {
	name?:string | null | undefined
	onDeletePost: (postId:string) => void
	kebabMenuRef?: React.RefObject<HTMLDivElement>;
	handleKebabMenuClick?: () => void;
	author:string;
	profile:string;
	formattedTime: string;
	showOptions?:boolean;
	handleShowModal: () => void;
	id: string;
}
function PostAuthor(props: PostAuthorProps) {


	return (
		<div className={classes.profileContainer}>
			<Link href={`/${encodeURIComponent(props.author)}`}>
				<div className={classes.profile}>
					<img
						src={props.profile}
						alt={props.author}
					/>
					<div className={classes.postAuthor}>
						<span>{props.author}</span>
						<span className={classes.postDate}>{props.formattedTime}</span>
					</div>
				</div>
			</Link>
			{props.author === props.name! && (
				<div
					className={classes.kebabMenu}
					ref={props.kebabMenuRef}
				>
					<GoKebabHorizontal onClick={props.handleKebabMenuClick} data-cy='kebab-menu' />
					{props.showOptions && (
						<div className={classes.options}>
							<button
								className={classes.optionButton}
								onClick={props.handleShowModal}
								data-cy='edit-post'
							>
								<AiOutlineEdit />
								Edit
							</button>
							<hr />
							<button
								className={classes.optionButton}
								onClick={() => props.onDeletePost(props.id)}
								data-cy='delete-post'
							>
								<BsTrash />
								Delete
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
export default PostAuthor;
