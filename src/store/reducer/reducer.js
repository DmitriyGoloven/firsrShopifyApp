import {handleActions} from "redux-actions";
import {getProductCount, setActivePage} from "./actions";


const defaultState = {
    productCount: 0,
    activePage: ""

}

const getProduct = (state, {payload}) => {
    // console.log(payload)
    return {...state, productCount: payload.data.count}

}

export const reducer = handleActions({
    [getProductCount.success]: getProduct,
    [setActivePage]: (state, payload) => {
        return {...state, activePage: payload.payload}
    }

}, defaultState)

export default reducer;

