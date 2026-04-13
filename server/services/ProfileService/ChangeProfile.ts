import { Router, Request, Response } from 'express';
import {supabase} from "@server/utils/supabase";
import { checkAuthorization } from '@/server/utils/authorization';

// username/handle HANDLER \\
const usernameHandler = async (res: Response, userID: string, handle: string) => {
    // check for overlapping existing handle \\
    const {data: overlappingData, error: overlappingError} = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle()
    if (overlappingData != null)  return res.status(500).json({__isAuthError: false, code: "handle_taken"});
    if (overlappingError) return res.status(500).json({__isAuthError: false, code: "setting_error"});

    const {data, error} = await supabase.from("profiles").update({handle: handle}).eq("id", userID).single()
    if (error) {
        console.log(error)
        return res.status(500).json({__isAuthError: false, code: "setting_error"});
    }


    return res.status(200).json({__isAuthError: false, code: "success", success: true});
}

const displayHandler = async (res: Response, userID: string, display_name: string) => {
    const {data, error} = await supabase.from("profiles").update({display_name: display_name}).eq("id", userID).single()
    // console.log("display_name", data, error);
    if (error) return res.status(500).json({__isAuthError: false, code: "setting_error"}); console.log(error)

    return res.status(200).json({__isAuthError: false, code: "success", success: true});
}

const handlers = {
    handle: usernameHandler,
    display_name: displayHandler
}

const changeDetailPOST = async (req: Request , res: Response) => {
    const { detail, value  } = req.body;
    const { authorization : authorizationToken } = req.headers;

    // initial check \\
    if (detail == undefined || value == undefined || authorizationToken == undefined) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return

    const userId = data?.user.id
    const {data : profileData, error : profileError} = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (profileError) return res.status(400).json({__isAuthError: false, code: "invalid_profile"})


    // different detail handlers \\
    // @ts-ignore
    const handler = handlers[detail]
    console.log(handlers, detail)
    if (handler == undefined) return res.status(400).json({__isAuthError: false, code: "invalid_handler"})

    await handler(res, userId, value)

    // check for existing handle \\
    // if (data != undefined && data.success) return res.status(500).json({__isAuthError: true, code: "handle_taken"});
}

export default changeDetailPOST;