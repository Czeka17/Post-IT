import { useState } from 'react';
import classes from './user-profile.module.css'
import Image from 'next/image';
import FileResizer from 'react-image-file-resizer';
function UserProfile(props){
    const [profileImage, setProfileImage] = useState('');
    function selectImageHandler(e){
        const file = e.target.files[0];

    FileResizer.imageFileResizer(
      file,
      300, // New width
      300, // New height
      'PNG', // Output format
      100, // Quality
      0, // Rotation
      (uri) => {
        console.log(uri);
        setProfileImage(uri);
      },
      'base64' // Output type
    );
    }

    function submitHandler(event){
        event.preventDefault()

        props.onChangeProfile({
            image: profileImage,
            username: props.username
        })
    }

    return <div className={classes.profile}>
    <Image src={props.image} width={300} height={300} />
    {props.activeUser === props.username ? <form onSubmit={submitHandler}>
        <input type="file" name="file" onChange={selectImageHandler} />
    <button>Change image</button>
    </form> : ''}
    <h2>{props.username}</h2>
</div>
}

export default UserProfile;