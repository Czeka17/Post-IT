import { useRef, useState } from "react";
import AddPostForm from "./add-post-form";
import CloudinaryUploader from "./cloudinary-uploader";

interface NewPostProps {
	onAddPost: (postData: PostData) => void;
	name: string;
	userImage: string;
}

interface PostData {
	message: string | undefined;
	name: string;
	userImage: string;
	image: {
		type: "image" | "video" | "gif";
		url: string;
	} | null;
}

function NewPost(props: NewPostProps) {
	const [media, setMedia] = useState<{
		type: "image" | "video" | "gif";
		url: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const messageInputRef = useRef<HTMLTextAreaElement>(null);
	const placeholderOptions = [
		"Share your thoughts...",
		"Write something interesting...",
		"Tell us your story...",
		"Ask a question or start a discussion...",
		"Share a funny joke or meme...",
	];
	function deleteMedia() {
		setMedia(null);
	}
	function MediaLoaderShow() {
		setIsLoading(true);
	}
	function MediaLoaderHide() {
		setIsLoading(false);
	}

	function sendPostHandler(e: any) {
		e.preventDefault();

		const enteredMessage = messageInputRef.current?.value;

		if (
			(!enteredMessage && media === null) ||
			(enteredMessage?.trim() === "" && media === null)
		) {
			return;
		}

		props.onAddPost({
			message: enteredMessage,
			name: props.name,
			userImage: props.userImage,
			image: media,
		});
		if (messageInputRef.current?.value) {
			messageInputRef.current.value = "";
		}
		setMedia(null);
	}

	function handleUpload(media: {
		type: "image" | "video" | "gif";
		url: string;
	}) {
		setMedia(media);
	}
	function getRandomPlaceholder() {
		const randomIndex = Math.floor(Math.random() * placeholderOptions.length);
		return placeholderOptions[randomIndex];
	}
	const placeholder = getRandomPlaceholder();

	return (
		<AddPostForm
			onSendPost={sendPostHandler}
			placeholder={placeholder}
			messageInputRef={messageInputRef}
			isLoading={isLoading}
			media={media}
			deleteMedia={deleteMedia}
		>
			<CloudinaryUploader
				onUpload={handleUpload}
				onLoading={MediaLoaderShow}
				onLoadingEnd={MediaLoaderHide}
			/>
		</AddPostForm>
	);
}

export default NewPost;
