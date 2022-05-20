import {
    Card,
    Page,
    Layout,
    TextContainer,
    Heading, DisplayText, TextStyle, Button,
} from "@shopify/polaris";

import {useAppBridge, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation,useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";

import {userLoggedInFetch} from "../App";

export function HomePage() {

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const [productCount, setProductCount] = useState(0);
    const [productCount1, setProductCount1] = useState(0);
    const [productCount2, setProductCount2] = useState(0);

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    async function updateProductCount() {
        const {count} = await fetch("/products/count").then((res) => res.json());
        setProductCount(count);
    }
    async function updateProduct() {
        const {count} = await fetch("/product").then((res) => res.json());
        setProductCount1(count)
        console.log({count});
    }
    async function updateProductu() {
        const {count} = await fetch("/productu").then((res) => res.json());
        setProductCount2(count)
        console.log({count});
    }



    useEffect(() => {
        updateProductCount();
        updateProduct()
        updateProductu()
    }, []);

    const routeProducts = () => {
        let path = `/ProductsPage`;
        navigate(path);
    }

    return (
        <Page fullWidth title={"Home page"}>
            <Layout>
                <Layout.Section oneThird>
                    <Card title="Product Count" sectioned>
                        <TextContainer spacing="loose">
                            <Heading element="h4">
                                TOTAL PRODUCTS
                                <DisplayText size="medium">
                                    <TextStyle variation="strong">{productCount}</TextStyle>
                                </DisplayText>
                            </Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section oneThird>
                    <Card title="Product Count" sectioned>
                        <TextContainer spacing="loose">
                            <Heading element="h4">
                                PUBLISHED
                                <DisplayText size="medium">
                                    <TextStyle variation="strong">{productCount1}</TextStyle>
                                </DisplayText>
                            </Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section oneThird>
                    <Card title="Product Count" sectioned>
                        <TextContainer spacing="loose">
                            <Heading element="h4">
                                UNPUBLISHED
                                <DisplayText size="medium">
                                    <TextStyle variation="strong">{productCount2}</TextStyle>
                                </DisplayText>
                            </Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                <Button
                    primary
                    onClick={routeProducts}
                >
                    View products
                </Button>
                </Layout.Section>
            </Layout>
        </Page>
    );
}