export const differentiationFirst = (x, y) => {
    let h = x[1] - x[0];
    let arr = []
    let arr_error_rate = []

    arr.push( (1/(6*h)) * (-11*y[0] + 18*y[1] - 9*y[2] + 2*y[3]) );
    arr.push( (1/(6*h)) * (-2*y[0] - 3*y[1] + 6*y[2] - y[3]) );
    arr.push( (1/(6*h)) * (y[0] - 6*y[1] + 3*y[2] + 2*y[3]) );
    arr.push( (1/(6*h)) * (-2*y[0] + 9*y[1] - 18*y[2] + 11*y[3]) );

    arr_error_rate.push(-1*h**3/4);
    arr_error_rate.push(h**3/12);
    arr_error_rate.push(-1*h**3/12);
    arr_error_rate.push(h**3/4);

    return {
        derivatives: arr,
        error_coefficients: arr_error_rate
    };

}

export const differentiationSecond = (x, y) => {
    let h = x[1] - x[0];
    let arr = []
    let arr_error_rate = []

    arr.push( (1/(h**2)) * (2*y[0] - 5*y[1] + 4*y[2] - y[3]) );
    arr.push( (1/(h**2)) * (y[0] - 2*y[1] + y[2]) );
    arr.push( (1/(h**2)) * (y[1] - 2*y[2] + y[3]) );
    arr.push( (1/(h**2)) * (-1*y[0] + 4*y[1] - 5*y[2] + 2*y[3]) );

    arr_error_rate.push(11*h**2/12);
    arr_error_rate.push(-1*h**2/12);
    arr_error_rate.push(-1*h**2/12);
    arr_error_rate.push(11*h**2/12);

    return {
        derivatives: arr,
        error_coefficients: arr_error_rate
    };

}