import classes from './post-image.module.css'
interface PostImage{
    image: {
		url: string | undefined;
		type: "image" | "video" | "gif" | undefined;
	};
    onImageDelete?: () => void;
}
function PostImage({image,onImageDelete}:PostImage){
    return <div>
        {image && (image.type === "image" || image.type === "gif") ? (
        <div className={classes.image}>
            <img
                src={image.url}
                alt={"Post Image"}
            />
            {onImageDelete && <button onClick={onImageDelete}>X</button>}
        </div>
    ) : (
        image &&
        image.type === "video" && (
            <div className={classes.image}>
                {" "}
                <video
                    controls
                    className={classes.video}
                >
                    <source
                        src={image.url}
                        type='video/mp4'
                    />
                    Your browser does not support the video tag.
                </video>
               {onImageDelete && <button onClick={onImageDelete}>X</button>}
            </div>
        )
    )}
    </div>
}
export default PostImage;