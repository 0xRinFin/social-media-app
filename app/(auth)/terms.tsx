import {Text, View} from "react-native";
import {Link} from "expo-router";
import TabPage from "../../components/Tabs/TabPage";
import {OnboardingAnimated} from "../../components/Onboarding/OnboardingAnimated";

const terms = [
    "Използвай Linque уважително и не публикувай съдържание, което обижда, заплашва или вреди на други хора.",
    "Ти носиш отговорност за информацията, снимките и съобщенията, които споделяш в профила си.",
    "Не използвай приложението за спам, измами, фалшиви профили или действия, които нарушават закона.",
    "Пази данните си за вход и не предоставяй паролата си на други потребители.",
    "Можем да ограничим достъпа до акаунт, ако тези условия не се спазват.",
];

const Terms = () => {
    return (
        <TabPage title={"Общи условия"} titleVisible={true} className={"p-6 pb-28"}>
            <View className={"flex gap-6"}>
                <OnboardingAnimated>
                    <Text className={"text-white text-xl font-light pt-4"}>
                        Това са основните условия за използване на Linque.
                    </Text>
                </OnboardingAnimated>

                <View className={"flex gap-5"}>
                    {terms.map((term, index) => (
                        <OnboardingAnimated key={term}>
                            <View className={"flex flex-row gap-4"}>
                                <Text className={"w-8 text-amber-300 text-lg font-medium"}>{index + 1}.</Text>
                                <Text className={"flex-1 text-neutral-200 text-lg font-light"}>{term}</Text>
                            </View>
                        </OnboardingAnimated>
                    ))}
                </View>
            </View>

            <View className={"absolute bottom-10 w-screen items-center"}>
                <Link href={"sign-up bg-red-200"}>
                    <Text className={"text-amber-300 text-center"}>Обратно</Text>
                </Link>
            </View>
        </TabPage>
    );
};

export default Terms;
