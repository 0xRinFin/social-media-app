import { Response } from "express";
import { supabase } from "./supabase";

export const checkAuthorization = async (authorizationToken: string, res: Response) => {
    // check authorization \\
    const { data, error } = await supabase.auth.getUser(authorizationToken);
    if (error || data == undefined || data.user == undefined) {
        res.status(401).json({__isAuthError: true, code: "authorization_failed"})
        return {success: false, data: null}
    }

    return {success: true, data}
}