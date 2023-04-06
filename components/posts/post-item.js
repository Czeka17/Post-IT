import classes from './post-item.module.css'
import Image from 'next/image';
function PostItem(props){

    return(
        <li className={classes.item}>
            <div>
                <div className={classes.content}>
                <div className={classes.profile}>
                        <img src={props.profile}/>
                        <h3>{props.author}</h3>
                    </div>
                    <p>{props.title}</p>
                    <div className={classes.image}>
                        <Image src={props.image} alt={props.title} width={600} height={600} />
                    </div>
                </div>
            </div>
        </li>
    )
}

export default PostItem;