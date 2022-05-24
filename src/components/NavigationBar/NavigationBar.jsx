import React, {useEffect} from 'react';
import {useAppBridge} from "@shopify/app-bridge-react";
import {AppLink, NavigationMenu, TitleBar, Redirect, Button} from "@shopify/app-bridge/actions";

const NavigationBar = ({activePage, setActivePage}) => {

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
    });

    const addProduct = Button.create(app, {label: 'Add product'});
    addProduct.subscribe(Button.Action.CLICK, () => {
        app.dispatch(Redirect.toApp({path: '/AddProductPage'}));
    });
    const titleBarOptions = {
        title: '',
        buttons: {
            secondary: [addProduct],
        }
    };

    useEffect(() => {
        myTitleBar.set({title: activePage});
        setActiveMenu()
    }, [activePage])

    function setActiveMenu() {
        switch (activePage) {
            case "Home Page":
                navigationMenu.set({active: HomePageLink})
                break
            case "Products Page":
                navigationMenu.set({active: ProductsPageLink})
                break
            case "Add Product":
                navigationMenu.set({active: AddProductLink})
                break
            case "Products Page / Edit Product":
                navigationMenu.set({active: ProductsPageLink})
                break
        }
    }

    const myTitleBar = TitleBar.create(app, titleBarOptions);

    return null
}

export default NavigationBar;