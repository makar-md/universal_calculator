import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../mathFunctions/parseExpression"
import "../global.css"


export default function Index() {
  const [text, setText] = useState('');
  const [interval, setInterval] = useState('');
  const [accuracy, setAccuracy] = useState('');

  const [expr, setExpr] = useState(null);

  const BtnClick = () => {
    try {
      const f = parseExpression(text)
      setExpr(() => f)
    } catch (e) {
      console.log(e.message)
    }
    console.log(interval);
    console.log(accuracy);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <View className="flex flex-col mx-auto w-11/12 md:w-1/2 gap-4">
          <Text className="font-bold text-xl text-zinc-900"> Введите выражение</Text>

          <TextInput value={text} onChangeText={setText} className="border border-zinc-900 px-2 py-1 rounded-xl text-zinc-900 placeholder:text-zinc-400" placeholder="sin(x) + ln(x) + x^2"/>
        
          <View className="flex flex-col gap-4">
            <View className="flex flex-row gap-20">
              <Text className="font-bold text-xl text-zinc-900 flex-1">Интервал: </Text>
              <Text className="font-bold text-xl text-zinc-900 flex-1">Точность: </Text> 
            </View>
            <View className="flex flex-row gap-20">
              <TextInput value={accuracy} onChangeText={setInterval} className="border border-zinc-900 px-2 py-1 rounded-xl text-zinc-900 flex-1 placeholder:text-zinc-400" placeholder="0;3"/>
              <TextInput value={interval} onChangeText={setAccuracy} className="border border-zinc-900 px-2 py-1 rounded-xl text-zinc-900 flex-1 placeholder:text-zinc-400" placeholder="10^-3"/>
            </View>
          </View>

          <Pressable onPress={BtnClick} className="px-3 py-1 rounded-xl bg-orange-500 flex w-48 self-center">
            <Text className="text-zinc-50 text-lg font-bold text-center">Метод дихотомии</Text>
          </Pressable>

          <Text className="font-bold text-xl text-zinc-900">
            {expr ? expr(1) : "Нет функции"}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}