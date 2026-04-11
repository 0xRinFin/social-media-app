import { Router, Request, Response } from 'express';
import {supabase} from "../utils/supabase";
import {checkAuthorization} from "@/server/services/ChangeProfileService";
import {randomUUID} from "node:crypto";

const commentPOST = async (req: Request, res: Response) => {
    console.log("meow")
    const { content, postId } = req.body;
    const { authorization : authorizationToken } = req.headers;

    if (!authorizationToken) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    // check for authorization \\
    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return

    // check comment content \\
    if (content === "" || typeof content != "string") return res.status(400).json({__isAuthError: false, code: "invalid_request"})

    // generate comment id \\
    const uuid = randomUUID()

    // upload comment \\
    const {data: commentData} = await supabase.from("comments").upsert({
        id: uuid,
        post_id: postId,
        user_id: data.user.id,
        content: content,
    }).single()

    console.log("new comment", commentData)

    res.status(200).json({code: "success", uuid: uuid})
}

export default commentPOST;