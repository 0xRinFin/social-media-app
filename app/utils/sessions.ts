import * as SecureStore from 'expo-secure-store';

// Save tokens
async function saveSession(session) {
    await SecureStore.setItemAsync('access_token', session.access_token);
    await SecureStore.setItemAsync('refresh_token', session.refresh_token);
}

// Load tokens on app start
async function loadSession() {
    const access_token = await SecureStore.getItemAsync('access_token');
    const refresh_token = await SecureStore.getItemAsync('refresh_token');
    return { access_token, refresh_token };
}

// Delete tokens on logout
async function clearSession() {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
}