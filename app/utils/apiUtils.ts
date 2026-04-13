import { AuthSession } from "@supabase/supabase-js";

const BASE_URL = 'http://192.168.0.106:3111';

type Controllers = "ProfileController" | "MessageController" | "PostController"

export async function serverFetch(path: string, options?: RequestInit) {
    return fetch(`${BASE_URL}${path}`, options);
}

export async function apiCall(params: {
    method: "POST" | "GET" | "DELETE",
    session?: AuthSession,

    controller: Controllers,
    route: string,
    body: {}
}) {
    const headers: RequestInit["headers"] = {
        "Content-Type": "application/json",
    }

    if (params.session != undefined) {
        headers["Authorization"] = params.session.access_token
    }

    const res = await serverFetch(`/api/${params.controller}/${params.route}`, {
        method: params.method,
        headers: headers,

        body: JSON.stringify(params.body)
    })

    
    const parsed = await res.json()
    return parsed
}
