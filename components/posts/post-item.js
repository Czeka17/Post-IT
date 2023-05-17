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
                    {props.image && <div className={classes.image}>
                        <Image src={props.image} alt={props.title} width={600} height={600} />
                    </div>}
                </div>
                <div className={classes.reaction}>
                    <div>
                        <p>Like</p>
                    </div>
                    <div>
                        <p>Comment</p>
                    </div>
                </div>
                <div className={classes.comments}>
                    <ul>
                        <li>
                            <div className={classes.comment}>
                                <img src={props.profile}/>
                                <div className={classes.commentContent}>
                                <h4>{props.author}</h4>
                                <p>Dobre!</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </li>
    )
}

export default PostItem;