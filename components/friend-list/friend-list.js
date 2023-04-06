import classes from './friend-list.module.css'

function FriendList(props) {
return (
    <section className={classes.position}>
        <div>
            <h2>Friend List</h2>
        </div>
        <div>
            <ul>
                {props.friends.map((friend) => (
                    <li className={classes.list} key={friend.id}><img src={friend.picture} /><p>{friend.name}</p></li>
                ))}
            </ul>
        </div>
    </section>
)
}

export default FriendList;