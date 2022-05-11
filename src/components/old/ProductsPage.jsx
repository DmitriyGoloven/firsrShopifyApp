import { gql, useQuery } from "@apollo/client";
import {Page, Layout, Banner, Card, Thumbnail, ResourceList, Stack, TextStyle} from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
// import { ProductsList } from "./ProductsList";
// import { ApplyRandomPrices } from "./ApplyRandomPrices";

// GraphQL query to retrieve products by IDs.
// The price field belongs to the variants object because
// product variants can have different prices.
const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              id
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

export function ProductsPage({ productIds }) {
    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_BY_ID, {
        variables: { ids: productIds },
    });
    if (loading) return <Loading />;

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

    return (
        <Page>
            <Layout>
                <Layout.Section>

                    {/*<Card>*/}
                    {/*    <ProductsList data={data} />*/}
                    {/*</Card>*/}

                    <Card>
                    <ResourceList // Defines your resource list component
                        showHeader
                        resourceName={{ singular: "Product", plural: "Products" }}

                        items={data.nodes}
                        renderItem={(item) => {
                            const media = (
                                <Thumbnail
                                    source={
                                        item.images.edges[0] ? item.images.edges[0].node.originalSrc : ""
                                    }
                                    alt={item.images.edges[0] ? item.images.edges[0].node.altText : ""}
                                />
                            );
                            const price = item.variants.edges[0].node.price;
                            return (
                                <ResourceList.Item
                                    id={item.id}
                                    media={media}
                                    // accessibilityLabel={`View details for ${item.title}`}
                                    // onClick={() => {
                                    //     store.set("item", item);
                                    // }}
                                >
                                    <Stack>
                                        <Stack.Item fill>
                                            <h3>
                                                <TextStyle variation="strong">{item.title}</TextStyle>
                                            </h3>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p>${price}</p>
                                        </Stack.Item>
                                    </Stack>
                                </ResourceList.Item>
                            );
                        }}
                    />

                    </Card>

                    {/*<ApplyRandomPrices selectedItems={data.nodes} onUpdate={refetch} />*/}
                </Layout.Section>
            </Layout>
        </Page>
    );
}

