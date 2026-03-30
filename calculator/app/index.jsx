import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../mathFunctions/parseExpression";
import "../global.css";

export default function Index() {
  const [text, setText] = useState('');
  const [interval, setInterval] = useState('');
  const [accuracy, setAccuracy] = useState('');

  const [expr, setExpr] = useState(null);
  const [steps, setSteps] = useState([]); // массив шагов метода дихотомии

  const BtnClick = () => {
    try {
      const f = parseExpression(text);
      setExpr(() => f);

      // Разбираем интервал и точность
      const parts = interval.split(';');
      const a = parseFloat(parts[0]);
      const b = parseFloat(parts[1]);

      const eps = parseFloat(accuracy);

      if (isNaN(a) || isNaN(b) || isNaN(eps)) {
        setSteps(["Ошибка: проверьте интервал и точность"]);
        return;
      }

      let fa = f(a);
      let fb = f(b);

      if (fa * fb > 0) {
        setSteps(["Ошибка: f(a)*f(b) > 0, метод дихотомии неприменим"]);
        return;
      }

      let left = a;
      let right = b;
      let mid = left; //середина
      let stepCount = 0;
      let stepArray = [];

      while ((right - left)/2 > eps) {
        mid = (left + right)/2;
        const fmid = f(mid);
        stepCount++;
        let d = left - right;

        stepArray.push(`Шаг ${stepCount}: a=${left.toFixed(6)}, b=${right.toFixed(6)}, d=${d.toFixed(6)}, mid=${mid.toFixed(6)}, f(a)=${fa.toFixed(6)}, f(b)=${fb.toFixed(6)}, f(mid)=${fmid.toFixed(6)},`);

        if (fa * fmid <= 0) {
          right = mid;
          fb = fmid;
        } else {
          left = mid;
          fa = fmid;
        }

        if (stepCount > 1000) {
          stepArray.push("Превышено 1000 итераций, остановка");
          break;
        }
        stepArray.push(`[${left.toFixed(6)}; ${right.toFixed(6)}]`);
      }

      stepArray.push(`Корень ≈ ${mid.toFixed(6)} после ${stepCount} итераций`);
      setSteps(stepArray);

    } catch (e) {
      console.log(e.message);
      setSteps(["Ошибка функции: " + e.message]);
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
              <TextInput value={interval} onChangeText={setInterval} className="border border-zinc-900 px-2 py-1 rounded-xl text-zinc-900 flex-1 placeholder:text-zinc-400" placeholder="0;3"/>
              <TextInput value={accuracy} onChangeText={setAccuracy} className="border border-zinc-900 px-2 py-1 rounded-xl text-zinc-900 flex-1 placeholder:text-zinc-400" placeholder="10^-3"/>
            </View>
          </View>

          <Pressable onPress={BtnClick} className="px-3 py-1 rounded-xl bg-orange-500 flex w-48 self-center">
            <Text className="text-zinc-50 text-lg font-bold text-center">Метод дихотомии</Text>
          </Pressable>

          <Text className="font-bold text-xl text-zinc-900">
            {expr ? expr(1) : "Нет функции"}
          </Text>

          {/* Вывод шагов метода дихотомии */}
          <ScrollView className="mt-4 h-64 border border-zinc-300 rounded-xl p-2">
            {steps.map((step, index) => (
              <Text key={index} className="text-zinc-900 mb-1">{step}</Text>
            ))}
          </ScrollView>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}