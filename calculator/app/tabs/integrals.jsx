import { View } from "react-native";

export default function Integration(){
    return (
        <SafeAreaProvider>
          <SafeAreaView className="flex-1">
                <View>
                    <Text>Интегрирование</Text>
                </View>
          </SafeAreaView>
        </SafeAreaProvider>
      );
}