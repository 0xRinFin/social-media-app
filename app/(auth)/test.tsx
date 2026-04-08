import { useEffect } from 'react';
import { Button, View } from 'react-native';
import {WrappedButton} from "../../components/WrappedButton";
import {fetch} from "expo/fetch";

import {apiFetch} from "../utils/apiFetch";

async function fetchHello() {
    try {
        const response = await apiFetch('/api/ProfileController');
        const data = await response.json();
        console.log("hello " + data.hello);

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

export default function App() {
    useEffect(() => {
        // fetchHello();
    }, []);

    return (
        <View className={'h-full items-center justify-center bg-black p-20'}>
            <WrappedButton title="Fetch Hello" onClick={fetchHello} isAnimated={true} isActive={true} />
        </View>
    );
}