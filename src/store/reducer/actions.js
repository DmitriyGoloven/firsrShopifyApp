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
        url: '/rest',
        headers: {urlPath: '/count.json'}
    }
}));

export const getPublishedProducts = createRequestAction('GET_PUBLISHED_PRODUCTS', () => ({
    request: {
        method: 'get',
        url: '/rest',
        headers: {urlPath: '/count.json?published_status=published'}
    }
}));

export const getUnPublishedProducts = createRequestAction('GET_UNPUBLISHED_PRODUCTS', () => ({
    request: {
        method: 'get',
        url: '/rest',
        headers: {urlPath: '/count.json?published_status=unpublished'}
    }
}));


export const setActivePage = createAction('SET_ACTIVE_PAGE', (payload) => {
    return payload
})

