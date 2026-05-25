import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../mathFunctions/parseExpression";
import { IntegrationSquare} from "../mathFunctions/IntegrationSquare"
import { IntegrationTrapeze} from "../mathFunctions/IntegrationTrapeze"
import "../global.css";

export default function Integrals() {

  const [func, setFunc] = useState('');
  const [interval, setInterval] = useState('');
  const [steps, setSteps] = useState('');
  const [result, setResult] = useState(null);

  function getData(){
    const f = parseExpression(func);

    const [a, b] = interval.split(';').map(Number);
    const stepCount = Function(`return ${steps.replace("^", "**")}`)();
    if (isNaN(a) || isNaN(b) || isNaN(stepCount)) {
      setSteps([]);
      setResult(null);
      alert("Пожалуйста, убедитесь, что все поля введены корректно!");
      return null;
    }
    const data = {
      f:f,
      a:a,
      b:b,
      n:stepCount
    };
    return data;
  }

  const handleSquare = () => {
    try {
      const data = getData()
      const res = IntegrationSquare(data.f, data.a, data.b, data.n);
      setResult(res);
    } catch (e) {
      alert("Ошибка метода: " + e.message);
    }
  };
  const handleTrapeze = () => {
    try {
      const data = getData()
      const res = IntegrationTrapeze(data.f, data.a, data.b, data.n);
      setResult(res);
    } catch (e) {
      alert("Ошибка метода: " + e.message);
    }
  };
  

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 pt-3">
        <View className="flex flex-col mx-auto w-11/12 gap-4">
          <Text className="text-teal-600 text-2xl font-semibold text-center">Интегрирование</Text>
          {/* Ввод данных */}
            <Text className="font-bold text-xl text-zinc-900">Введите выражение</Text>
            <TextInput
              value={func}
              onChangeText={setFunc}
              placeholder="sin(x) + ln(x) + x^2"
              className="border border-zinc-900 px-2 py-1 rounded-xl placeholder:text-zinc-500"
            />

            <View className="flex flex-row gap-4">
              <TextInput
                value={interval}
                onChangeText={setInterval}
                placeholder="0 ; 3"
                className="border border-zinc-900 px-2 py-1 rounded-xl flex-1 placeholder:text-zinc-500"
              />
              <TextInput
                value={steps}
                onChangeText={setSteps}
                placeholder="0.1"
                className="border border-zinc-900 px-2 py-1 rounded-xl flex-1 placeholder:text-zinc-500"
              />
            </View>

            <View className="flex flex-row gap-4 justify-center">
              <Pressable onPress={handleSquare} className="bg-orange-500 px-3 py-1 rounded-xl">
                <Text className="text-white font-bold">Прямоугольники</Text>
              </Pressable>
              <Pressable onPress={handleTrapeze} className="bg-orange-500 px-3 py-1 rounded-xl">
                <Text className="text-white font-bold">Трапеции</Text>
              </Pressable>
            </View>

            <Text className="text-red-600 text-2xl font-semibold text-center">{result}</Text>
          </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}