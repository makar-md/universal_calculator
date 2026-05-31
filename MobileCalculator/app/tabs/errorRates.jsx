import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { compareEqualities, roundByRelativeError, roundByAbsoluteError, findLimitErrors } from "../../mathFunctions/errorAnalysis";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import "../../global.css";

export default function ErrorAnalysis() {
  // состояние для выбора типа задачи (a, b или c)
  const [taskType, setTaskType] = useState('a');
  
  // состояния для задачи а (сравнение двух равенств)
  const [exact1, setExact1] = useState('');      // точное значение первого числа
  const [approx1, setApprox1] = useState('');    // приближённое значение первого числа
  const [exact2, setExact2] = useState('');      // точное значение второго числа
  const [approx2, setApprox2] = useState('');    // приближённое значение второго числа
  
  // состояния для задачи б (округление числа по погрешности)
  const [bNumber, setBNumber] = useState('');               // исходное число
  const [bError, setBError] = useState('');                 // значение погрешности
  const [bErrorType, setBErrorType] = useState('relative'); // тип погрешности (relative/absolute)
  
  // состояние для задачи в (предельные погрешности)
  const [cNumber, setCNumber] = useState('');     // приближённое число
  const [result, setResult] = useState(null);     // состояние для хранения результата вычислений
  const [loading, setLoading] = useState(false);  // состояние загрузки (индикатор выполнения)

  /**
  * Обработчик нажатия кнопки вычисления
  * Выполняет расчёты в зависимости от выбранного типа задачи
  */
  const handleSolve = () => {
    setLoading(true);                              
    setTimeout(() => {
      try {
        // задача а: сравнение точности двух равенств
        if (taskType === 'a') {
          // проверка заполнения всех полей
          if (!exact1 || !approx1 || !exact2 || !approx2) {
            throw new Error('Заполните все поля');
          }
          // вычисление погрешностей и сравнение
          const res = compareEqualities(
            parseFloat(exact1), parseFloat(approx1),
            parseFloat(exact2), parseFloat(approx2)
          );
          setResult(res);                          // сохранение результата
        } 
        // задача б: округление числа по погрешности
        else if (taskType === 'b') {
          // проверка заполнения полей
          if (!bNumber) {
            throw new Error('Введите число');
          }
          if (!bError) {
            throw new Error('Введите погрешность');
          }
          
          // выбор метода округления в зависимости от типа погрешности
          if (bErrorType === 'relative') {
            // округление по относительной погрешности
            const res = roundByRelativeError(parseFloat(bNumber), parseFloat(bError));
            setResult(res);
          } else {
            // округление по абсолютной погрешности
            const res = roundByAbsoluteError(parseFloat(bNumber), parseFloat(bError));
            setResult(res);
          }
        } 
        // задача в: нахождение предельных погрешностей
        else if (taskType === 'c') {
          // проверка заполнения поля
          if (!cNumber) {
            throw new Error('Введите число');
          }
          // вычисление предельных абсолютной и относительной погрешностей
          const res = findLimitErrors(parseFloat(cNumber));
          setResult(res);
        }
      } catch (error) {
        alert("Ошибка: " + error.message);        
        setResult(null);                           
      } finally {
        setLoading(false);                         
      }
    }, 100);
  };

  /**
  * Очистка всех полей ввода и результата
  */
  const clearAll = () => {
    setExact1('');
    setApprox1('');
    setExact2('');
    setApprox2('');
    setBNumber('');
    setBError('');
    setCNumber('');
    setResult(null);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
            
            <View className="mt-4 mb-6">
              <Text className="text-zinc-500 text-base">
                Numerical Methods
              </Text>
              <Text className="text-white text-4xl font-bold mt-1">
                Error Analysis
              </Text>
            </View>

            <View className="flex-row gap-3 mb-6">
              <Pressable onPress={() => { setTaskType('a'); setResult(null); }} className={`flex-1 py-3 rounded-2xl ${taskType === 'a' ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`}>
                <Text className="text-white text-center font-semibold">Задача а</Text>
              </Pressable>
              <Pressable onPress={() => { setTaskType('b'); setResult(null); }} className={`flex-1 py-3 rounded-2xl ${taskType === 'b' ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`}>
                <Text className="text-white text-center font-semibold">Задача б</Text>
              </Pressable>
              <Pressable onPress={() => { setTaskType('c'); setResult(null); }} className={`flex-1 py-3 rounded-2xl ${taskType === 'c' ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`}>
                <Text className="text-white text-center font-semibold">Задача в</Text>
              </Pressable>
            </View>

            {taskType === 'a' && (
              <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
                <View className="px-5 py-4">
                  <Text className="text-[#8E8E93] text-sm mb-3 text-center">Сравнение двух равенств</Text>
                  
                  <Text className="text-white text-sm mb-2">Первое равенство</Text>
                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                      <Text className="text-[#8E8E93] text-xs mb-1">Точное значение</Text>
                      <TextInput value={exact1} onChangeText={setExact1} keyboardType="numeric" placeholder="14/17" placeholderTextColor="#8E8E93" className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"/>
                    </View>
                    <View className="flex-1">
                      <Text className="text-[#8E8E93] text-xs mb-1">Приближённое</Text>
                      <TextInput value={approx1} onChangeText={setApprox1} keyboardType="numeric" placeholder="0.824" placeholderTextColor="#8E8E93" className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"/>
                    </View>
                  </View>
                  
                  <Text className="text-white text-sm mb-2">Второе равенство</Text>
                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                      <Text className="text-[#8E8E93] text-xs mb-1">Точное значение</Text>
                      <TextInput value={exact2} onChangeText={setExact2} keyboardType="numeric" placeholder="√53" placeholderTextColor="#8E8E93" className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"/>
                    </View>
                    <View className="flex-1">
                      <Text className="text-[#8E8E93] text-xs mb-1">Приближённое</Text>
                      <TextInput value={approx2} onChangeText={setApprox2} keyboardType="numeric" placeholder="7.28" placeholderTextColor="#8E8E93" className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"/>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {taskType === 'b' && (
              <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
                <View className="px-5 py-4">
                  <Text className="text-[#8E8E93] text-sm mb-3 text-center">Округление числа</Text>
                  
                  <View className="flex-row gap-3 mb-4">
                    <Pressable onPress={() => setBErrorType('relative')} className={`flex-1 py-2 rounded-xl ${bErrorType === 'relative' ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`}>
                      <Text className="text-white text-center text-sm">Относительная δ</Text>
                    </Pressable>
                    <Pressable onPress={() => setBErrorType('absolute')} className={`flex-1 py-2 rounded-xl ${bErrorType === 'absolute' ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`}>
                      <Text className="text-white text-center text-sm">Абсолютная Δ</Text>
                    </Pressable>
                  </View>
                  
                  <Text className="text-white text-sm mb-2">Число</Text>
                  <TextInput value={bNumber} onChangeText={setBNumber} keyboardType="numeric" placeholder="23.3748" placeholderTextColor="#8E8E93" className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white mb-4"/>
                  
                  <Text className="text-white text-sm mb-2">{bErrorType === 'relative' ? 'Относительная погрешность δ (%)' : 'Абсолютная погрешность Δ'}</Text>
                  <TextInput value={bError} onChangeText={setBError} keyboardType="numeric" placeholder={bErrorType === 'relative' ? "0.27" : "0.0072"} placeholderTextColor="#8E8E93" className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"/>
                </View>
              </View>
            )}

            {taskType === 'c' && (
              <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
                <View className="px-5 py-4">
                  <Text className="text-[#8E8E93] text-sm mb-3 text-center">Предельные погрешности</Text>
                  
                  <Text className="text-white text-sm mb-2">Приближённое число</Text>
                  <TextInput value={cNumber} onChangeText={setCNumber} keyboardType="numeric" placeholder="0.645" placeholderTextColor="#8E8E93" className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"/>
                  
                  <Text className="text-[#8E8E93] text-xs mt-3 text-center">Все цифры числа верные</Text>
                </View>
              </View>
            )}

            <View className="flex-row gap-4 mb-6">
              <Pressable onPress={handleSolve} className="flex-1">
                <View className="bg-[#0A84FF] py-4 rounded-2xl">
                  <Text className="text-white text-center font-semibold text-lg">ВЫЧИСЛИТЬ</Text>
                </View>
              </Pressable>
              
              <Pressable onPress={clearAll} className="flex-1">
                <View className="bg-[#2C2C2E] py-4 rounded-2xl">
                  <Text className="text-white text-center font-semibold text-lg">ОЧИСТИТЬ</Text>
                </View>
              </Pressable>
            </View>

            {result && taskType === 'a' && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-6">
                <Text className="text-[#8E8E93] text-sm text-center mb-3">РЕЗУЛЬТАТ</Text>
                
                <View className="bg-[#2C2C2E] rounded-xl p-3 mb-3">
                  <Text className="text-white text-sm">Первое равенство</Text>
                  <Text className="text-[#8E8E93] text-xs">Точное: {result.first.exact}</Text>
                  <Text className="text-[#8E8E93] text-xs">Приближённое: {result.first.approx}</Text>
                  <Text className="text-[#FF9F0A] text-xs">Δ = {result.first.absoluteError.toExponential(6)}</Text>
                  <Text className="text-[#FF9F0A] text-xs">δ = {result.first.relativeErrorPercent.toFixed(6)}%</Text>
                </View>
                
                <View className="bg-[#2C2C2E] rounded-xl p-3 mb-3">
                  <Text className="text-white text-sm">Второе равенство</Text>
                  <Text className="text-[#8E8E93] text-xs">Точное: {result.second.exact}</Text>
                  <Text className="text-[#8E8E93] text-xs">Приближённое: {result.second.approx}</Text>
                  <Text className="text-[#FF9F0A] text-xs">Δ = {result.second.absoluteError.toExponential(6)}</Text>
                  <Text className="text-[#FF9F0A] text-xs">δ = {result.second.relativeErrorPercent.toFixed(6)}%</Text>
                </View>
                
                <Text className="text-[#30D158] text-base font-bold text-center mt-2">{result.conclusion}</Text>
              </View>
            )}

            {result && taskType === 'b' && result.rounded !== undefined && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-6">
                <Text className="text-[#8E8E93] text-sm text-center mb-3">РЕЗУЛЬТАТ</Text>
                
                <Text className="text-white text-center text-lg mb-2">Исходное число: {result.original}</Text>
                <Text className="text-[#FF9F0A] text-center text-sm">
                  {bErrorType === 'relative' ? `δ = ${result.relativeErrorPercent}%` : `Δ = ${result.absoluteError}`}
                </Text>
                <Text className="text-[#FF9F0A] text-center text-sm mb-3">
                  {bErrorType === 'relative' ? `Δ = ${result.absoluteError.toExponential(6)}` : `δ = ${(result.absoluteError / Math.abs(result.original) * 100).toFixed(6)}%`}
                </Text>
                
                <View className="bg-[#2C2C2E] rounded-xl p-3">
                  <Text className="text-white text-center">Округлённое число:</Text>
                  <Text className="text-[#30D158] text-2xl text-center font-bold mt-1">{result.roundedStr}</Text>
                  <Text className="text-[#8E8E93] text-xs text-center mt-1">(оставлено {result.decimalPlaces} знаков после запятой)</Text>
                </View>
              </View>
            )}

            {result && taskType === 'b' && result.resultStr && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-6">
                <Text className="text-[#8E8E93] text-sm text-center mb-3">РЕЗУЛЬТАТ</Text>
                
                <Text className="text-white text-center text-lg mb-2">{result.original} ± {result.absoluteError}</Text>
                
                <View className="bg-[#2C2C2E] rounded-xl p-3">
                  <Text className="text-white text-center">Округлённое число:</Text>
                  <Text className="text-[#30D158] text-2xl text-center font-bold mt-1">{result.resultStr}</Text>
                  <Text className="text-[#8E8E93] text-xs text-center mt-1">(оставлено {result.decimalPlaces} знаков после запятой)</Text>
                </View>
              </View>
            )}

            {result && taskType === 'c' && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-6">
                <Text className="text-[#8E8E93] text-sm text-center mb-3">РЕЗУЛЬТАТ</Text>
                
                <Text className="text-white text-center text-2xl mb-4">{result.number}</Text>
                
                <View className="bg-[#2C2C2E] rounded-xl p-3 mb-3">
                  <Text className="text-[#8E8E93] text-xs text-center">Предельная абсолютная погрешность:</Text>
                  <Text className="text-[#30D158] text-lg text-center font-bold mt-1">{result.absoluteErrorExp}</Text>
                </View>
                
                <View className="bg-[#2C2C2E] rounded-xl p-3">
                  <Text className="text-[#8E8E93] text-xs text-center">Предельная относительная погрешность:</Text>
                  <Text className="text-[#30D158] text-lg text-center font-bold mt-1">{result.relativeErrorExp}</Text>
                </View>
              </View>
            )}

            {loading && (
              <View className="absolute inset-0 bg-black/50 justify-center items-center">
                <View className="bg-[#1C1C1E] rounded-[28px] p-8 items-center">
                  <ActivityIndicator size="large" color="#0A84FF"/>
                  <Text className="text-white mt-4">Вычисление...</Text>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}