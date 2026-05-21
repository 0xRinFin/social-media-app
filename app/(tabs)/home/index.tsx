import {WrappedButton} from "components/WrappedButton";
import TabPage, { TabProps } from "components/Tabs/TabPage";
import {useRouter} from "expo-router";
import { baseEditButtonStyle } from '../profile/editprofile';
import { View } from "react-native";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/authentication/use-auth-context";
import { supabase } from "@/app/utils/supabase";
import { followerInfo } from "@/components/Tabs/Follows/FollowPage";
import { PostInfo } from "@/components/Tabs/Post/ViewPost";
import Post from "@/components/Tabs/Post/Post";
import { ProfileData } from "@/components/UserDisplay";


const Home = () => {
	const router = useRouter();
	const {profile} = useAuthContext();

	const [follows, setFollows] = useState<followerInfo[]>([]);
	const [posts, setPosts] = useState<PostInfo[]>([]);

	const [refreshCount, setRefreshCount] = useState(0)

	const fetchFollowed = async () => {
		if (profile == undefined) return;

		const {data} = await supabase.from("follows").select("*").eq("follower_id", profile.id);
		if (data == null) return

		setFollows(data as [followerInfo])
	}

	const fetchPosts = async () => {
		const results = await Promise.all(
			follows.map(async (follow) => {
			if (!follow) return []

			const { data } = await supabase
				.from("posts")
				.select("*")
				.eq("user_id", follow.following_id)

			if (!data) return []

			return data.sort((a: PostInfo, b: PostInfo) => {
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			})
			})
		)

		const usersPosts = results.flat()
		setPosts(usersPosts)
	}

	const refresh = () => {
		setRefreshCount(past => past + 1)
	}

	const refreshPost: TabProps["onRefresh"] = async (setRefreshing) => {
		setRefreshing(true)
		await fetchFollowed()
		refresh()
		setRefreshing(false)
	}


	useEffect(() => {
		fetchFollowed()
	}, [fetchFollowed, refreshCount])

	useEffect(() => {
		fetchPosts()
	}, [follows])


	return (
		<TabPage title={"Начало"} className={"p-4 flex gap-3 h-full "} onRefresh={refreshPost}>
			<WrappedButton isActive={true} title={"Качи публикация"} extraClassName={baseEditButtonStyle} onClick={
				() => router.push("home/post/uploadpost")
			} isAnimated={true}/>

			<View>
				{posts.map((post,i) => {
					return (<Post postId={post.id} refresh={() => {}} showComments={false} key={i}/>)
				})}
			</View>
		</TabPage>
	);
};

export default Home;
