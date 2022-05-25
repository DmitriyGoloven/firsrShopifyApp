import {handleActions} from "redux-actions";
import {getProductCount, getPublishedProducts, getUnPublishedProducts, setActivePage} from "./actions";


const defaultState = {
    productCount: 0,
    productsPublished: 0,
    productsUnPublished: 0,
    activePage: ""

}

const getProducts = (state, {payload}) => {
    return {...state, productCount: payload.data.count}
}

const getProductsPublished = (state, {payload}) => {
    return {...state, productsPublished: payload.data.count}
}

const getUnProductsPublished = (state, {payload}) => {
    return {...state, productsUnPublished: payload.data.count}
}

export const reducer = handleActions({
    [getProductCount.success]: getProducts,
    [getPublishedProducts.success]: getProductsPublished,
    [getUnPublishedProducts.success]: getUnProductsPublished,
    [setActivePage]: (state, payload) => {
        return {...state, activePage: payload.payload}
    }

}, defaultState)

export default reducer;

