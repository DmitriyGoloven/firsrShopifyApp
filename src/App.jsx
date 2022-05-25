import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import {
    Provider as AppBridgeProvider,
    useAppBridge
} from "@shopify/app-bridge-react";
import {authenticatedFetch} from "@shopify/app-bridge-utils";
import {Redirect} from "@shopify/app-bridge/actions";
import {AppProvider as PolarisProvider, Page} from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import ProductsPage from "./components/ProductsPage/index.jsx";
import HomePage from "./components/HomePage/index.jsx";
import AddProductPage from "./components/AddProductPage/index.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EditProductPage from "./components/EditProductPage/index.jsx";
import NavigationBar from "./components/NavigationBar/index.jsx";

export default function App() {

    return (
        <BrowserRouter>
            <PolarisProvider i18n={translations}>
                <AppBridgeProvider
                    config={{
                        apiKey: process.env.SHOPIFY_API_KEY,
                        host: new URL(location).searchParams.get("host"),
                        forceRedirect: true,
                    }}>

                    <MyProvider>
                        <NavigationBar/>
                        <Routes>
                            <Route exact path="/ProductsPage" element={<ProductsPage/>}/>
                            <Route exact path="/AddProductPage" element={<AddProductPage/>}/>
                            <Route exact path="/EditProductPage/:id" element={<EditProductPage/>}/>
                            <Route exact path="/HomePage" element={<HomePage/>}/>
                            <Route exact path='/*' element={<HomePage/>}/>
                        </Routes>
                    </MyProvider>
                </AppBridgeProvider>
            </PolarisProvider>
        </BrowserRouter>
    );
}

function MyProvider({children}) {
    const app = useAppBridge();

    const client = new ApolloClient({

        cache: new InMemoryCache(),
        link: new HttpLink({
            credentials: "include",
            fetch: userLoggedInFetch(app),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'no-cache',
                    nextFetchPolicy: 'no-cache',
                    errorPolicy: 'ignore',
                },
                query: {
                    fetchPolicy: 'no-cache',
                    nextFetchPolicy: 'no-cache',
                    errorPolicy: 'all',
                },
            },
        }),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
    const fetchFunction = authenticatedFetch(app);

    return async (uri, options) => {
        const response = await fetchFunction(uri, options);

        if (
            response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
        ) {
            const authUrlHeader = response.headers.get(
                "X-Shopify-API-Request-Failure-Reauthorize-Url"
            );

            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
            return null;
        }

        return response;
    };


}





