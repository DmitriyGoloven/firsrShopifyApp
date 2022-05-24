import {handleActions} from "redux-actions";
import {getProductCount} from "./actions";


const defaultState = {
    productCount: 0,

}

const getProduct = (state, {payload}) => {
    console.log(payload)
    return {...state, productCount: payload.data.count}

}

export const reducer = handleActions({
    [getProductCount.success]: getProduct,

}, defaultState)

export default reducer;

