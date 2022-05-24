import {getSessionToken} from "@shopify/app-bridge-utils";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import {applyMiddleware, createStore} from "redux";
import reducer from "./reducer/reducer";
import {useAppBridge} from "@shopify/app-bridge-react";
import createApp from "@shopify/app-bridge";

const app = createApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    host: new URL(location).searchParams.get("host"),
    forceRedirect: true,
});

const instance = axios.create();
// Intercept all requests on this Axios instance
instance.interceptors.request.use(function (config) {
    return getSessionToken(app) // requires a Shopify App Bridge instance
        .then((token) => {
            // Append your request headers with an authenticated token
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
        });
});
// Export your Axios instance to use within your app
export const store = createStore(
    reducer,
    applyMiddleware(
        axiosMiddleware(instance)
    )
);