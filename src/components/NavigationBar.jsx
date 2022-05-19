import React from 'react';
import { useAppBridge} from "@shopify/app-bridge-react";
import {AppLink, NavigationMenu, TitleBar, Redirect, Button} from "@shopify/app-bridge/actions";

const NavigationBar = () => {

    const app = useAppBridge();

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

    const addProduct = Button.create(app, { label: 'Add product' });
    addProduct.subscribe(Button.Action.CLICK, () => {
        app.dispatch(Redirect.toApp({ path: '/AddProductPage' }));
    });
    const titleBarOptions = {
        title: 'HomePage',
        buttons: {
            secondary: [addProduct],}
    };

    app.subscribe(Redirect.Action.APP, (path) => {
        let link = navigationMenu.children.find(children =>
            children.destination === path.path)
        navigationMenu.set({active: link})

        myTitleBar.set({
            title: navigationMenu.activeOptions.destination.replace(
                navigationMenu.activeOptions.destination[0], "", 1),
        });
    })

    const myTitleBar = TitleBar.create(app, titleBarOptions);

    return null
}

export default NavigationBar;