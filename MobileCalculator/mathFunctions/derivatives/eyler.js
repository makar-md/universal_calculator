/**
* Решение дифференциальных уравнений методом Эйлеа
*
* @param func функция
* @param y_0 значение y_0
* @param h шаг по оси x
* @param a граница решения уравнения
* @param b граница решения уравнения
*
* @returns массив y для каждого x в соответствии с шагом
*/
export const Eyler = (func, y_0, h, a, b) =>{
    let y = []                      // полученные значения
    let xValues = []                // значения x
    let steps = []                  // результат
    let start =  Math.min(a, b)     // левая граница
    let end =  Math.max(a, b)       // правая граница

    // заполняем массив x идя от a до b с шагом в h
    for(let i = start; i <= end; i+=h){
        xValues.push(i)
    }

    // устанавливаем начальный элемент
    y[0] = y_0 

    //считаем y в каждой точке x
    for (let i = 1; i < xValues.length; i++) {
        // решение в соответствии с формулой
        const x_prev = xValues[i - 1];
        const y_prev = y[i - 1];
        const derivative = func(x_prev, y_prev);  
        y[i] = y_prev + h * derivative;

        //заполняем результат
        steps.push({
            iteration: i,
            x: x_prev,
            y: y_prev,
        })
    }

    return steps;
}