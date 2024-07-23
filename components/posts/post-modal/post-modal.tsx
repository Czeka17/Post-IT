import classes from "./post-modal.module.css";
import CloudinaryUploader from "../add-post/cloudinary-uploader";
import { AiOutlineSend, AiFillFileAdd } from "react-icons/ai";
import PostImage from "../post-image/post-image";
interface PostItemProps {
	onSubmit: () => void;
	onImageDelete: () => void;
	onImageUpload: (media: {
		type: "image" | "video" | "gif";
		url: string;
	}) => void;
	onBackdropClick: (event: React.MouseEvent<HTMLDivElement>) => void;
	onMediaLoaderHide: () => void;
	onMediaLoaderShow: () => void;
	onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onLoading: boolean;
	image: {
		url: string | undefined;
		type: "image" | "video" | "gif" | undefined;
	};
	inputValue: string;
	onHideModal: () => void;
}

function PostModal(props: PostItemProps) {
	return (
		<div
			className={classes.postModal}
			onClick={props.onBackdropClick}
		>
			<div className={classes.postContent}>
				<textarea
					value={props.inputValue}
					onChange={props.onChange}
				/>
				<div className={classes.actions}>
					<button className={classes.file}>
						Add/Change file
						<div>
							<label
								htmlFor='file'
								className={classes.fileButton}
							>
								<AiFillFileAdd />
								<CloudinaryUploader
									onUpload={props.onImageUpload}
									onLoading={props.onMediaLoaderShow}
									onLoadingEnd={props.onMediaLoaderHide}
								/>
							</label>
						</div>
					</button>
					{props.image && (
						<button
							className={classes.deleteButton}
							onClick={props.onImageDelete}
						>
							Delete file
						</button>
					)}
				</div>
				{props.onLoading && <div className={classes.loader}></div>}
				<PostImage image={props.image} onImageDelete={props.onImageDelete} />
				<button
					className={classes.closeButton}
					onClick={props.onHideModal}
				>
					X
				</button>
				<div className={classes.submitContainer}>
					<button
						className={classes.submitButton}
						onClick={props.onSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
export default PostModal;
