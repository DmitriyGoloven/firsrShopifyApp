// @ts-check
import {resolve} from "path";
import express from "express";
import cookieParser from "cookie-parser";
import {ApiVersion, Shopify} from "@shopify/shopify-api";
import "dotenv/config";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import axios from "axios";
import mongoose from 'mongoose';
import {SessionModel} from "./MongoDB/sessionShema.js"
import {Session} from "@shopify/shopify-api/dist/auth/session/index.js";

mongoose.connect(`mongodb+srv://Dim:${process.env.PASDB}@cluster0.e0oewqf.mongodb.net/ShopifyApp?retryWrites=true&w=majority`, function (err) {

    if (err) throw err;
    console.log('Successfully connected MongoDB');
});


const storeCallback = async (session) => {
    console.log(ACTIVE_SHOPIFY_SHOPS)
    console.log("storeCallback get session", session.id)
    const result = await SessionModel.findOne({id:session.id});
    if (result) {

        await SessionModel.findOneAndUpdate(
            {id: session.id},
            {
                id: session.id,
                shop: session.shop,
                scope: session.scope,
                data: session,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );
        console.log("storeCallback SessionModel=find and update to",session.id)
    } else {
        await SessionModel.create({
            id: session.id,
            shop: session.shop,
            scope: session.scope,
            data: session,
        });
        console.log("storeCallback not find and create new ",session.id)
    }

    return true;
}

const loadCallback = async (id) => {
    const reply = await  SessionModel.findOne({id});
    if (reply) {
        console.log("loadCallback SessionModel=find",id)
        let session = reply.data;
        //static cloneSession(session: Session, newId: string): Session;
        return Session.cloneSession(session, session.id);
    }
    console.log("loadCallback SessionModel not find",id)
    return undefined
}

const deleteCallback = async (id) => {
    console.log("deleteCallback ", id)
    await SessionModel.deleteOne({id});
    return true;
}


const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: process.env.SCOPES.split(","),
    HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
    API_VERSION: ApiVersion.April22,
    IS_EMBEDDED_APP: true,
    // This should be replaced with your preferred storage strategy
    SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
        storeCallback,
        loadCallback,
        deleteCallback
    ),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
 const ACTIVE_SHOPIFY_SHOPS = {};

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: async (topic, shop, body) => {
        await SessionModel.deleteOne({shop});
    },
});

// export for test use only
export async function createServer(
    root = process.cwd(),
    isProd = process.env.NODE_ENV === "production"
) {
    const app = express();
    console.log("create server")
    app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
    // app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
    app.set("use-online-tokens", USE_ONLINE_TOKENS);

    app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

    applyAuthMiddleware(app);

    app.post("/webhooks", async (req, res) => {
        try {
            await Shopify.Webhooks.Registry.process(req, res);
            console.log(`Webhook processed, returned status code 200`);
        } catch (error) {
            console.log(`Failed to process webhook: ${error}`);
            if (!res.headersSent) {
                res.status(500).send(error.message);
            }
        }
    });


    // app.get("/products/count", verifyRequest(app), async (req, res) => {
    //   const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    //   const { Product } = await import(
    //     `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    //   );
    //
    //   const countData = await Product.count({ session });
    //   res.status(200).send(countData);
    // });


    app.get("/rest", verifyRequest(app), async (req, res) => {

        let baseUrl = "https://devitapp.myshopify.com/admin/api/2022-04/products" + req.headers.urlpath
        const session = await Shopify.Utils.loadCurrentSession(req, res, true);

        const {data} = await axios.get(baseUrl, {
            headers: {
                'X-Shopify-Access-Token': session.accessToken
            }
        });
        res.status(200).send(data);
    })

    app.post("/graphql", verifyRequest(app), async (req, res) => {
        try {
            const response = await Shopify.Utils.graphqlProxy(req, res);
            res.status(200).send(response.body);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.use(express.json());

    app.use((req, res, next) => {
        const shop = req.query.shop;
        if (Shopify.Context.IS_EMBEDDED_APP && shop) {
            res.setHeader(
                "Content-Security-Policy",
                `frame-ancestors https://${shop} https://admin.shopify.com;`
            );
        } else {
            res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
        }
        next();
    });

    app.use("/*",async (req, res, next) => {
        const {shop} = req.query;
        // Detect whether we need to reinstall the app, any request from Shopify will
        // include a shop in the query parameters.

        // if (app.get("active-shopify-shops")[shop] === undefined && shop) {
        //     res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
        // } else {
        //     next();
        // }


        // console.log("active shop =",shop , "shopMONGO = ",await SessionModel.findOne({shop}))
        if (await SessionModel.findOne({shop}) === null && shop) {
            (console.log("//////////////////redirect true"))
            res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
        } else {
            next();
        }



    });

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite;
    if (!isProd) {
        vite = await import("vite").then(({createServer}) =>
            createServer({
                root,
                logLevel: isTest ? "error" : "info",
                server: {
                    port: PORT,
                    hmr: {
                        protocol: "ws",
                        host: "localhost",
                        port: 64999,
                        clientPort: 64999,
                    },
                    middlewareMode: "html",
                },
            })
        );
        app.use(vite.middlewares);
    } else {
        const compression = await import("compression").then(
            ({default: fn}) => fn
        );
        const serveStatic = await import("serve-static").then(
            ({default: fn}) => fn
        );
        const fs = await import("fs");
        app.use(compression());
        app.use(serveStatic(resolve("dist/client")));
        app.use("/*", (req, res, next) => {
            // Client-side routing will pick up on the correct route to render, so we always render the index here
            res
                .status(200)
                .set("Content-Type", "text/html")
                .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
        });
    }

    return {app, vite};
}

if (!isTest) {
    createServer().then(({app}) => app.listen(PORT));
}


