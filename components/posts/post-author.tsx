import Link from "next/link";
import classes from './post-author.module.css'
import {BsTrash} from 'react-icons/bs'
import { useSession } from "next-auth/react";
import { GoKebabHorizontal } from "react-icons/go";
import {useState, useRef, useEffect} from 'react';
import {AiOutlineEdit} from "react-icons/ai";
interface PostAuthorProps{
    author: string;
    profile: string;
    id: string;
    onDeletePost: (postId: string) => void;
    formattedTime: string;
    handleShowModal: () => void
}
function PostAuthor(props : PostAuthorProps){
    const [showOptions, setShowOptions] = useState(false);
    const { data: session, status } = useSession();

    const handleKebabMenuClick = () => {
		setShowOptions(!showOptions);
	};
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (kebabMenuRef.current && !kebabMenuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


    const deletePostHandler = async (postId:string) => {
		try {
			const response = await fetch("/api/posts/addPost", {
				method: "DELETE",
				body: JSON.stringify({postId:postId}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				props.onDeletePost(postId);
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || "Something went wrong!");
			}
		} catch (error) {
			console.error(error);
		}
	};


return <div className={classes.profileContainer}>
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
{props.author === session?.user?.name && (
<div className={classes.kebabMenu} ref={kebabMenuRef}>
    <GoKebabHorizontal onClick={handleKebabMenuClick} />
    {showOptions && (
        <div className={classes.options}>
            <button className={classes.optionButton} onClick={props.handleShowModal}><AiOutlineEdit />Edit</button>
<hr/>
            <button className={classes.optionButton} onClick={() =>deletePostHandler(props.id)}><BsTrash />Delete</button>
        </div>
    )}
</div>)}
</div>
}
export default PostAuthor;