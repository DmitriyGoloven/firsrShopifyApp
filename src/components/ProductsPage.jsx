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
import {useEffect, useState, useCallback} from "react";

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

const PRODUCTS_COUNT = 4

export function ProductsPage() {

    const [getProducts, {loading, error, data, previousData}] = useLazyQuery(GET_PRODUCTS)
    const [sortValue, setSortValue] = useState('A-Z')

    useEffect(() => {
        getProducts({
            variables: {
                count: PRODUCTS_COUNT,
            }
        });
    }, []);

    const nextPage = useCallback(()=> {
        getProducts({
            variables: {
                endCursor: data.products.pageInfo.endCursor,
                count: PRODUCTS_COUNT,
                startCursor: null,
                countLast: null

            }
        });
    },[data]);

    const previousPage = useCallback(() => {
        getProducts({
            variables: {
                startCursor: data.products.pageInfo.startCursor,
                countLast: PRODUCTS_COUNT,
                endCursor: null,
                count: null
            }
        });
    }, [data]);

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

    // console.log(data)
    // console.log(previousData)
    // console.log(loading)
    // if (loading || !data) return <Loading/>;
    if (!data && !previousData) return <Loading/>

    const paginationInfo = data ? data.products.pageInfo : previousData.products.pageInfo
    return (

        <Page>
            <Layout>
                <Layout.Section>
                    <Pagination
                        hasPrevious={paginationInfo.hasPreviousPage}
                        onPrevious={previousPage}
                        hasNext={paginationInfo.hasNextPage}
                        onNext={nextPage}
                    />
                    <Card>
                        <ResourceList
                            loading={loading}
                            sortValue={sortValue}
                            sortOptions={[
                                {label: 'A-Z', value: 'A-Z'},
                                {label: 'Z-A', value: 'Z-A'},
                            ]}
                            onSortChange={(selected) => {
                                setSortValue(selected)
                                let reversValue = (selected === 'Z-A')
                                getProducts({
                                    variables: {
                                        revers: reversValue,
                                        count: PRODUCTS_COUNT,
                                        startCursor: null,
                                        countLast: null,
                                        endCursor: null,

                                    }
                            })}}
                            showHeader
                            resourceName={{singular: 'product', plural: 'products'}}
                            items={data ? data.products.edges : previousData.products.edges}
                            renderItem={(item) => {
                                const imgNode = item.node.images.edges[0]
                                const media = (
                                    <Thumbnail
                                        source={imgNode ? imgNode.node.originalSrc : ""}
                                        alt={imgNode ? imgNode.node.altText : ""}
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

