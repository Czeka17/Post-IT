import { useState } from "react";
import PostModal from "./post-modal";
import { usePostsStore } from "../../../store/usePostsStore";
interface PostItemProps {
	id: string;
	title: string;
	image: {
		url: string | undefined;
		type: "image" | "video" | "gif" | undefined;
	};
	onHideModal: () => void;
}
function PostModalContainer(props: PostItemProps) {
	const { updatePost } = usePostsStore(state => ({
		updatePost:state.updatePost
	  }));
	const [inputValue, setInputValue] = useState(props.title);
	const [image, setImage] = useState(props.image);
	const [isLoading, setIsLoading] = useState(false);
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(event.target.value);
	};
	function MediaLoaderShow() {
		setIsLoading(true);
	}
	function MediaLoaderHide() {
		setIsLoading(false);
	}
	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			props.onHideModal();
		}
	};
	function handleImageUpload(media: {
		type: "image" | "video" | "gif";
		url: string;
	}) {
		setImage(media);
	}
	function handleImageDelete() {
		setImage({ url: undefined, type: undefined });
	}

	const handleSubmit = () => {
		updatePost(props.id, inputValue, image);
		props.onHideModal();
	};
	return (
		<PostModal
			onSubmit={handleSubmit}
			onImageDelete={handleImageDelete}
			onImageUpload={handleImageUpload}
			onBackdropClick={handleBackdropClick}
			onMediaLoaderHide={MediaLoaderHide}
			onMediaLoaderShow={MediaLoaderShow}
			onChange={handleChange}
			onLoading={isLoading}
			image={image}
			inputValue={inputValue}
			onHideModal={props.onHideModal}
		/>
	);
}
export default PostModalContainer;
