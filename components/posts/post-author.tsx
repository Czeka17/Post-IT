import Link from "next/link";
import classes from './post-author.module.css'
import {BsTrash} from 'react-icons/bs'
import { useSession } from "next-auth/react";
import { GoKebabHorizontal } from "react-icons/go";
import {useState, useRef, useEffect} from 'react';
import {AiOutlineEdit} from "react-icons/ai";
import usePosts from "../../hooks/usePosts";
interface PostAuthorProps{
    author: string;
    profile: string;
    id: string;
    onDeletePost: (postId: string) => void;
    formattedTime: string;
    handleShowModal: () => void
}
function PostAuthor(props : PostAuthorProps){
  const {deletePost} = usePosts()
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
            <button className={classes.optionButton} onClick={() => deletePost(props.id)}><BsTrash />Delete</button>
        </div>
    )}
    
</div>)}
</div>
}
export default PostAuthor;