import {
    Card,
    Page,
    Layout,
    TextContainer,
    Heading, DisplayText, TextStyle, Button,
} from "@shopify/polaris";

import {useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";


export function HomePage({
                             getProductCount,
                             productCount,
                             setActivePage,
                             productsUnPublished,
                             getUnPublishedProducts,
                             productsPublished,
                             getPublishedProducts
                         }) {

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    useEffect(() => {
        setActivePage("Home Page")
        getProductCount()
        getPublishedProducts()
        getUnPublishedProducts()
    }, [productCount]);

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
                                    <TextStyle variation="strong">{productsPublished}</TextStyle>
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
                                    <TextStyle variation="strong">{productsUnPublished}</TextStyle>
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