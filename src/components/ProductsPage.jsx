import {gql, useLazyQuery} from "@apollo/client";
import {
    Page,
    Layout,
    Banner,
    Card,
    Pagination,
    Thumbnail,
    ResourceItem,
    TextStyle,
    Stack,
    ResourceList
} from "@shopify/polaris";
import {Loading} from "@shopify/app-bridge-react";
import {useEffect, useState} from "react";

const GET_PRODUCTS = gql`
  query GetProducts($count: Int, $countLast: Int, $endCursor: String, $startCursor: String, $revers: Boolean) {
  products(first: $count, after: $endCursor,sortKey:TITLE, reverse: $revers,last: $countLast, before: $startCursor) {
    edges {
      cursor
      node {
        title
        status
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
              position
              weight
              price
              id
            }
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
`;

export function ProductsPage() {
    const PRODUCTS_COUNT = 4
    const [getProducts, {loading, error, data}] = useLazyQuery(GET_PRODUCTS)
    const [sortValue, setSortValue] = useState('A-Z')

    useEffect(() => {
        getProducts({
            variables: {
                count: PRODUCTS_COUNT,
            }
        });
    }, []);

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

    if (loading || !data) return <Loading/>;

    const nextPage = () => {

        getProducts({
            variables: {
                endCursor: data.products.pageInfo.endCursor,
                count: PRODUCTS_COUNT,
                startCursor: null,
                countLast: null

            }
        });
    }
    const previousPage = () => {

        getProducts({
            variables: {
                startCursor: data.products.pageInfo.startCursor,
                countLast: PRODUCTS_COUNT,
                endCursor: null,
                count: null
            }
        });
    }

    const reverse = () => {

        if (sortValue === 'A-Z') {
            getProducts({
                variables: {
                    revers: true,
                    count: PRODUCTS_COUNT
                }
            })

        } else {
            getProducts({
                variables: {
                    revers: false,
                    count: PRODUCTS_COUNT
                }
            })
        }
    }

    return (

        <Page>
            <Layout>
                <Layout.Section>
                    <Pagination
                        hasPrevious={data.products.pageInfo.hasPreviousPage}
                        onPrevious={previousPage}
                        hasNext={data.products.pageInfo.hasNextPage}
                        onNext={nextPage}
                    />
                    <Card>
                        <ResourceList
                            sortValue={sortValue}
                            sortOptions={[
                                {label: 'A-Z', value: 'A-Z'},
                                {label: 'Z-A', value: 'Z-A'},
                            ]}
                            onSortChange={(selected) => {
                                setSortValue(selected)
                                reverse();
                            }}
                            showHeader
                            resourceName={{singular: 'product', plural: 'products'}}
                            items={data.products.edges}
                            renderItem={(item) => {
                                const media = (
                                    <Thumbnail
                                        source={
                                            item.node.images.edges[0] ? item.node.images.edges[0].node.originalSrc : ""
                                        }
                                        alt={item.node.images.edges[0] ? item.node.images.edges[0].node.altText : ""}
                                    />
                                );
                                const price = item.node.variants.edges[0].node.price
                                const weight = item.node.variants.edges[0].node.weight
                                return (
                                    <ResourceItem id={item} media={media}>
                                        <h3>
                                            <TextStyle variation="strong">{item.node.title}</TextStyle>
                                        </h3>
                                        <Stack distribution="fillEvenly">
                                            <Stack.Item fill>
                                                <h3>
                                                    <TextStyle>{item.node.status}</TextStyle>
                                                </h3>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <p>weight: {weight}</p>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <p>price: ${price}</p>
                                            </Stack.Item>
                                        </Stack>
                                    </ResourceItem>
                                );
                            }}
                        />
                    </Card>

                </Layout.Section>
            </Layout>
        </Page>
    );
}

