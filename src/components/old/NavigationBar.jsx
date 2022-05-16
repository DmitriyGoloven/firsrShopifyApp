import createApp from '@shopify/app-bridge';
import {NavigationMenu, AppLink} from '@shopify/app-bridge/actions';

import React from 'react';

const NavigationBar = () => {
console.log("nawBar")
    const app = createApp({
        apiKey: process.env.SHOPIFY_API_KEY,
        host: new URL(location).searchParams.get("host"),
        forceRedirect: true,
    });
    const itemsLink = AppLink.create(app, {
        label: 'HomePage',
        destination: '/HomePage',
    });
    const settingsLink = AppLink.create(app, {
        label: 'ProductsPage',
        destination: '/ProductsPage',

    });
    const emptyStateLink = AppLink.create(app, {
        label: 'EmptyState',
        destination: '/EmptyStatePage',
    });
  const navigationMenu = NavigationMenu.create(app, {
        items: [itemsLink, settingsLink, emptyStateLink],
        // active: settingsLink
    });

    // navigationMenu.set({active: settingsLink})


    return null

};

export default {NavigationBar};



