import { useSession } from "next-auth/react";
import UserProfile from "../../components/profile/user-profile";
function ProfilePage() {
    const { data: session, status } = useSession()

    const username = session.user.name
    const image = session.user.image

    return <UserProfile image={image} username={username} />
}
export default ProfilePage;