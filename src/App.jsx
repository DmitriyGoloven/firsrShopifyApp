import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import {
    Provider as AppBridgeProvider, TitleBar,
    useAppBridge
} from "@shopify/app-bridge-react";
import {authenticatedFetch} from "@shopify/app-bridge-utils";
import {Redirect} from "@shopify/app-bridge/actions";
import {AppProvider as PolarisProvider, Page} from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {ProductsPage} from "./components/ProductsPage";
import {HomePage} from "./components/HomePage";
import {EmptyStatePage} from "./components/EmptyStatePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";



export default function App() {

    const primaryAction = {content: 'Foo', url: '/EmptyStatePage'};
    const secondaryActions = [{content: 'Bar', url: '/HomePage'}];


    return (

        <PolarisProvider i18n={translations}>
            <AppBridgeProvider
                config={{
                    apiKey: process.env.SHOPIFY_API_KEY,
                    host: new URL(location).searchParams.get("host"),
                    forceRedirect: true,
                }}>

                <MyProvider>
                    <BrowserRouter>
                        <TitleBar
                            title={location.pathname}
                            primaryAction={primaryAction}
                            secondaryActions={secondaryActions}
                        />
                        <NavigationBar/>
                        <Routes>
                            <Route exact path="/*" element={<ProductsPage/>}/>
                            {/*<Route exact path="/ProductsPage" element={<ProductsPage/>}/>*/}
                            {/*<Route exact path="/EmptyStatePage" element={<EmptyStatePage/>}/>*/}
                            {/*<Route exact path="/HomePage" element={<HomePage/>}/>*/}
                        </Routes>
                    </BrowserRouter>
                </MyProvider>
            </AppBridgeProvider>
        </PolarisProvider>
    );
}

function MyProvider({children}) {
    const app = useAppBridge();

    // let navigate = useNavigate();
    // useClientRouting({
    //     replace: navigate
    // })

    const client = new ApolloClient({
        queryDeduplication: false,
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'network-only',
            },
        },
        cache: new InMemoryCache(),
        link: new HttpLink({
            credentials: "include",
            fetch: userLoggedInFetch(app),
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





