import {Text, View, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent} from "react-native";
import { Image } from "expo-image";
import { WrappedButton } from "../WrappedButton";
import {useRef, useState} from "react";

export type Slide = {
    Title: string;
    Description: string;
    image: any; // use require() or { uri: string }
};

export type OnboardingPageProps = {
    slides: Slide[];
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
    buttonText?: string;
    onFinish: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const OnboardingPage = ({ slides, currentIndex, setCurrentIndex, buttonText, onFinish }: OnboardingPageProps) => {
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            return flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        }

        onFinish()
    };

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);

        if (index !== currentIndex) setCurrentIndex(index);
    };
    return (
        <View className="bg-black h-full pb-20">
            <FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={(_, i) => i.toString()}
                horizontal
                pagingEnabled
                scrollEnabled={true}
                scrollEventThrottle={16}
                onScroll={onScroll}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View
                        style={{ width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}
                    >
                        <Image
                            source={item.image}
                            contentFit="contain"
                            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT*0.45 }}
                        />
                        <Text className="text-white text-4xl text-center mt-5">{item.Title}</Text>
                        <Text className="text-neutral-200 text-base text-center mt-2">{item.Description}</Text>
                    </View>
                )}
            />

            <View className="absolute bottom-10 w-full px-10 gap-2">
                <View className="w-full h-4 justify-center items-center flex-row gap-2">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            className={`
                                ${index === currentIndex ? "bg-amber-300" : "bg-neutral-800"}
                                w-10 h-2
                                ${index === 0 ? "rounded-l" : index === slides.length - 1 ? "rounded-r" : ""}
                            `}
                        />
                    ))}
                </View>
                <WrappedButton
                    isActive={true}
                    title={buttonText ?? "Next"}
                    onClick={handleNext}
                    extraClassName="rounded-xl"
                    isAnimated={false}
                />
            </View>
        </View>
    );
};

export default OnboardingPage;