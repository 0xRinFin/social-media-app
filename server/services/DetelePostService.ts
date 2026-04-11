import { Router, Request, Response } from 'express';
import {supabase} from "../utils/supabase";
import {checkAuthorization} from "@/server/services/ChangeProfileService";

const deletepostPOST = async (req: Request, res: Response) => {
    const { postId } = req.body;
    const { authorization : authorizationToken } = req.headers;

    if (!authorizationToken) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    // check for authorization \\
    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return


    if (postId == undefined) return

    // remove if like exists \\
    await supabase.from("posts").delete().eq("id", postId).eq("user_id", data.user.id)
    res.status(200).json({code: "success"})
}

export default deletepostPOST;