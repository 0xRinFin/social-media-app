import FollowPage from "@/components/Tabs/Follows/FollowPage";
import { useLocalSearchParams } from "expo-router";

const FollowController = () => {
    const params = useLocalSearchParams()
    if (!params.type) return

    return (
        <FollowPage type={params.type}/>
    )
}

export default FollowController