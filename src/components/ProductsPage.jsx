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
    ResourceList,
    Filters,
    Button,
    TextField
} from "@shopify/polaris";
import {Loading} from "@shopify/app-bridge-react";
import {useEffect, useState, useCallback} from "react";

const GET_PRODUCTS = gql`
  query GetProducts($count: Int, $countLast: Int, $endCursor: String,
   $startCursor: String, $revers: Boolean, $search: String) {
  products(first: $count, after: $endCursor,sortKey:TITLE,
   reverse: $revers,last: $countLast, before: $startCursor, query: $search) {
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

    const [queryValue, setQueryValue] = useState("");
    const [getProducts, {loading, error, data, previousData}] = useLazyQuery(GET_PRODUCTS)
    const [sortValue, setSortValue] = useState('A-Z')


    let timeout;
    useEffect(() => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            getProducts({
                variables: {
                    count: PRODUCTS_COUNT,
                    search: queryValue
                }
            })
        }, 500);
    }, [queryValue]);

    const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

    const filterControl = (
        <Filters
            queryValue={queryValue}
            filters={[]}
            onQueryChange={setQueryValue}
            onQueryClear={handleQueryValueRemove}
        >
        </Filters>
    );

    const nextPage = useCallback(() => {
        getProducts({
            variables: {
                endCursor: data.products.pageInfo.endCursor,
                count: PRODUCTS_COUNT,
                startCursor: null,
                countLast: null

            }
        });
    }, [data]);

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
                                })
                            }}
                            showHeader
                            resourceName={{singular: 'product', plural: 'products'}}
                            items={data ? data.products.edges : previousData.products.edges}
                            renderItem={(item) => {
                                const {id, url, name, location} = item
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
                                    <ResourceItem id={id}
                                                  url={url}
                                                  media={media}
                                                  accessibilityLabel={`View details for ${name}`}>
                                        <h3>
                                            <TextStyle variation="strong">{item.node.title}</TextStyle>
                                        </h3>
                                        <Stack distribution="fillEvenly">
                                            <Stack.Item fill>
                                                <h3>
                                                    <TextStyle>{item.node.descriptionHtml}</TextStyle>
                                                </h3>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <p>weight: {weight}</p>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <p>price: ${price}</p>
                                            </Stack.Item>
                                        </Stack>
                                        <div>{location}</div>
                                    </ResourceItem>
                                );
                            }}
                            filterControl={filterControl}
                        />
                    </Card>

                </Layout.Section>
            </Layout>
        </Page>
    );
}

