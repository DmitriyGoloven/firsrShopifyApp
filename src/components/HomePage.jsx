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

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    async function updateProductCount() {
        const {count} = await fetch("/products/count").then((res) => res.json());
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