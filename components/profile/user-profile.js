import { useState } from 'react';
import classes from './user-profile.module.css'
import Image from 'next/image';
function UserProfile(props){
    const [profileImage, setProfileImage] = useState('');
    function selectImageHandler(e){
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result)
            setProfileImage(reader.result)
        }
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
    <form onSubmit={submitHandler}>
        <input type="file" name="file" onChange={selectImageHandler} />
    <button>Change image</button>
    </form>
    <h2>{props.username}</h2>
</div>
}

export default UserProfile;