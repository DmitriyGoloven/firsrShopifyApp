import {createAction} from "redux-actions"

const createRequestAction = (type, payload) => {
    const action = createAction(type, payload);
    action.success = type + '_SUCCESS';
    action.fail = type + '_FAIL';
    return action;
}


export const getProductCount = createRequestAction('GET_PRODUCT_COUNT', () => ({
    request: {
        method: 'get',
        url: '/products/count',
    }
}));

export const setActivePage = createAction('SET_ACTIVE_PAGE', (payload) => {
    return payload
})

