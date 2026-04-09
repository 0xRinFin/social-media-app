import { Router, Request, Response } from 'express';
import {supabase} from "../utils/supabase";
import {checkAuthorization} from "@/server/services/ChangeProfileService";

const followPOST = async (req: Request, res: Response) => {
    console.log("meow")
    const { handle } = req.body;
    const { authorization : authorizationToken } = req.headers;

    if (!authorizationToken) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    // check for authorization \\
    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return

    // get ids \\
    const {data : followingData, error} = await supabase.from("profiles").select("*").eq("handle", handle).single()
    if (error) return res.status(400).json({__isAuthError: false, code: "invalid_request"})

    const follower_id = data.user.id
    const following_id = followingData.id

    // if follow exists, remove it \\
    const {data: isFollowingData} = await supabase.from("follows").select("*").eq("following_id", following_id).eq("follower_id", follower_id).single()
    if (isFollowingData != null)
    {
        const {data: grr, error: zzz} = await supabase.from("follows").delete().eq("following_id", following_id).eq("follower_id", follower_id)
        return res.status(200).json({__isAuthError: false, code: "success"})
    }

    // new follow \\
    const {data: newFollowing, error: newFollowingError} = await supabase.from("follows").upsert({ follower_id, following_id })
    if (error)
        return res.status(400).json({__isAuthError: false, code: "invalid_request"})

    return res.status(200).json({__isAuthError: false, code: "success"})
}

export default followPOST;