import UsersList from "../components/users/users-list";

function usersPage() {
    const DUMMY_USERS = [
        {
            name: 'Jan Dzban',
            userImage: '/images/amogus.jpg',
            id: 'm1'
        },
        {
            name: 'Jan Dzban',
            userImage: '/images/amogus.jpg',
            id: 'm2'
        },
        {
            name: 'Jan Dzban',
            userImage: '/images/amogus.jpg',
            id: 'm3'
        },
    ]




    return (
        <UsersList users={DUMMY_USERS} />
    )
}

export default usersPage