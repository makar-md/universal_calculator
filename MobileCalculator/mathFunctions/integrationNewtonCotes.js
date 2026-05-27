export const IntegrationNewtonCotes = (f, a, b, n) => {
    
    let y = []
    let start = Math.min(a, b)
    let end = Math.max(a, b)
    let h = (end - start) / n
    
    for(let i = start; i <= end; i += h){
        y.push(f(i));
    }
    
    let weights, denom
    if(n === 1) { weights = [1, 1]; denom = 2 }
    else if(n === 2) { weights = [1, 4, 1]; denom = 6 }
    else if(n === 3) { weights = [1, 3, 3, 1]; denom = 8 }
    else if(n === 4) { weights = [7, 32, 12, 32, 7]; denom = 90 }
    else if(n === 5) { weights = [19, 75, 50, 50, 75, 19]; denom = 288 }
    else if(n === 6) { weights = [41, 216, 27, 272, 27, 216, 41]; denom = 840 }
    else { weights = [1, 4, 1]; denom = 6 }
    
    let sum = 0
    for(let i = 0; i < y.length; i++){
        sum += weights[i] * y[i]
    }
    
    let result = (end - start) * sum / denom
    return result
};

export const IntegrationNewtonCotesTable = (x, y) => {
    let h = x[1] - x[0]

    let weights, denom
    if(n === 1) { weights = [1, 1]; denom = 2 }
    else if(n === 2) { weights = [1, 4, 1]; denom = 6 }
    else if(n === 3) { weights = [1, 3, 3, 1]; denom = 8 }
    else if(n === 4) { weights = [7, 32, 12, 32, 7]; denom = 90 }
    else if(n === 5) { weights = [19, 75, 50, 50, 75, 19]; denom = 288 }
    else if(n === 6) { weights = [41, 216, 27, 272, 27, 216, 41]; denom = 840 }
    else { weights = [1, 4, 1]; denom = 6 }
    
    let sum = 0
    for(let i = 0; i < y.length; i++){
        sum += weights[i] * y[i]
    }
    
    let result = (end - start) * sum / denom
    return result
};


