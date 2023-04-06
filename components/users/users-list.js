import { useEffect, useState } from "react";
import User from "./user";
import classes from './users-list.module.css'
function UsersList(props){

    const [users,setUsers] = useState([])

    useEffect(() =>{
        fetch('/api/users/user').then(response => response.json()).then((data) => {
            setUsers(data.users)
        })
    }, [])
    return (
        <section>
            <div>
                <ul className={classes.userlist}>
                    {users.map((user) =>(
                        <User key={user._id} name={user.name} userImage={user.image} />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default UsersList