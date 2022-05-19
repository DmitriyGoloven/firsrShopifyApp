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
import {AppLink, NavigationMenu, Redirect} from "@shopify/app-bridge/actions";
import {AppProvider as PolarisProvider, Page} from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {ProductsPage} from "./components/ProductsPage";
import {HomePage} from "./components/HomePage";
import {AddProductPage} from "./components/AddProductPage";
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import EditProductPage from "./components/EditProductPage";
import {Children, useCallback, useEffect, useState} from "react";



export default function App() {

    const secondaryActions = [{content: 'Add product', url: '/AddProductPage'}];

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
                        <TitleBar

                            title={location.pathname.replace(location.pathname[0], "", 1)
                            }
                            secondaryActions={secondaryActions}
                        />

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


    const HomePageLink = AppLink.create(app, {
        label: 'Home page',
        destination: '/HomePage',
    });
    const ProductsPageLink = AppLink.create(app, {
        label: 'Products page',
        destination: '/ProductsPage',

    });
    const AddProductLink = AppLink.create(app, {
        label: 'Add product',
        destination: '/AddProductPage',
    });
    const navigationMenu = NavigationMenu.create(app, {
        items: [HomePageLink, ProductsPageLink, AddProductLink],
        active: HomePageLink,
    });

    // app.subscribe(Redirect.Action.APP, () => {navigationMenu.children.find(children =>
    //     children.destination === location.pathname)})

    // app.subscribe(Redirect.Action.APP, () => {
    //     navigationMenu.items.map((item, index)=>{
    //        if (item.destination.path === location.pathname)
    //             console.log(navigationMenu.items[index])
    //
    //     })})

    // app.subscribe(Redirect.Action.APP, () => {
    //     navigationMenu.items.map((item, index) => {
    //         if (navigationMenu.items[0].destination.path === location.pathname)
    //             navigationMenu.set({active: HomePageLink})
    //         else if (navigationMenu.items[1].destination.path === location.pathname)
    //             navigationMenu.set({active: ProductsPageLink})
    //         else if (navigationMenu.items[2].destination.path === location.pathname)
    //             navigationMenu.set({active: AddProductLink})
    //         else navigationMenu.set({active: HomePageLink})
    //
    //     })
    // })

    app.subscribe(Redirect.Action.APP, (path) => {
       let link = navigationMenu.children.find(children =>
            children.destination === path.path)
        navigationMenu.set({active: link})
        console.log(navigationMenu.activeOptions.destination)
    })
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





