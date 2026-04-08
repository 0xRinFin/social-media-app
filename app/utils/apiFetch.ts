const BASE_URL = 'http://192.168.0.106:3111';

export async function apiFetch(path: string, options?: RequestInit) {
    return fetch(`${BASE_URL}${path}`, options);
}