import {
    Card,
    Page,
    Layout,
    TextContainer,
    Heading, DisplayText, TextStyle, Button,
} from "@shopify/polaris";

import {useAppBridge, useClientRouting, useNavigate, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";

import {userLoggedInFetch} from "../App";

export function HomePage() {

    let location = useLocation();
    useRoutePropagation(location);
    console.log("HomePage")

    let navigate = useNavigate();

    useCallback(() => useClientRouting({
        replace: (path) => {
            navigate(path)
        }
    }), [navigate])


    const [productCount, setProductCount] = useState(0);

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    async function updateProductCount() {
        const {count} = await fetch("/products-count").then((res) => res.json());
        setProductCount(count);
    }

    useEffect(() => {
        updateProductCount();
    }, []);

    const routeProducts = () => {
        let path = `/ProductsPage`;
        navigate(path);
    }

    return (
        <Page fullWidth>
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
                                TOTAL PRODUCTS
                                <DisplayText size="medium">
                                    <TextStyle variation="strong">{productCount}</TextStyle>
                                </DisplayText>
                            </Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Button
                    primary
                    onClick={routeProducts}
                >
                    View products
                </Button>
            </Layout>
        </Page>
    );
}