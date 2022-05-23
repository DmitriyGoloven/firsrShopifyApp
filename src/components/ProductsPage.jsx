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
import {Loading, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useEffect, useState, useCallback, useMemo} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useSearchParams} from "react-router-dom";

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

const PRODUCTS_COUNT = 3

export function ProductsPage() {

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const [getProducts, {loading, error, data, previousData}] = useLazyQuery(GET_PRODUCTS)
    const [taggedWith, setTaggedWith] = useState('')
    const [searchParams, setSearchParams] = useSearchParams({revers: false, sortValue: "A-Z", queryValue: "",tagged: ""})

    const handleTaggedWithChange = useCallback((value) => {
        setTaggedWith(value);
        setSearchParams({tagged: value})
    }, [searchParams],);

    const changeSortValue = useCallback((sortValue) => {
        setSearchParams({queryValue: searchParams.get("queryValue"), sortValue: sortValue,
            tagged: searchParams.get("tagged")})
    }, [searchParams])

    const changeSearch = useCallback((queryValue) => {
        setSearchParams({sortValue: searchParams.get("sortValue"), queryValue: queryValue,
             tagged: searchParams.get("tagged")})
    }, [searchParams])

    const handleQueryValueRemove = useCallback(() => {
        setSearchParams({sortValue: searchParams.get("sortValue"),
            queryValue: "",tagged: searchParams.get("tagged")})}, [searchParams]);

    const handleTaggedWithRemove = useCallback(() => {
        setSearchParams({ sortValue: searchParams.get("sortValue"), tagged: "",});
        setTaggedWith("")}, []);


    const querySearch = useCallback(() => {
        return searchParams.get("tagged") ?
            `(title:${searchParams.get("queryValue")}*) AND (tag:${searchParams.get("tagged")}*)`
            : searchParams.get("queryValue")
    }, [searchParams,taggedWith])

    let timeout;
    useEffect(() => {
        // console.log(!isEmpty(searchParams.get("tagged")))
        clearTimeout(timeout)
         console.log(querySearch())
        timeout = setTimeout(() => {
            getProducts({
                variables: {
                    revers: searchParams.get("sortValue") === "Z-A",
                    count: PRODUCTS_COUNT,
                    search: querySearch(),
                    startCursor: null,
                    countLast: null,
                    endCursor: null,
                }
            })
        }, 500);
    }, [data,searchParams,taggedWith]);


    const filters = [
        {
            key: 'taggedWith1',
            label: 'Tagged with',
            filter: (
                <TextField
                    label="Tagged with"
                    value={searchParams.get("tagged")}
                    onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
    ];

    const appliedFilters = !isEmpty(searchParams.get("tagged"))
        ? [
            {
                key: 'taggedWith1',
                label: disambiguateLabel('taggedWith1', searchParams.get("tagged")),
                onRemove: handleTaggedWithRemove,
            },
        ]
        : [];

    const filterControl = (
        <Filters
            queryValue={searchParams.get("queryValue")}
            filters={filters}
            appliedFilters={appliedFilters}
            onQueryChange={changeSearch}
            onQueryClear={handleQueryValueRemove}
        >
            <div style={{paddingLeft: '8px'}}>
                <Button onClick={() => console.log('New filter saved')}>Save</Button>
            </div>
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

    const reverseSearch = useCallback((selected) => {

        getProducts({
            variables: {
                revers: selected,
                count: PRODUCTS_COUNT,
                startCursor: null,
                countLast: null,
                endCursor: null,

            }
        })
    }, [searchParams])

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }
    if (!data && !previousData) return <Loading/>

    const routeAddProduct = () => {
        let path = `/AddProductPage`;
        navigate(path);
    }


    const paginationInfo = data ? data.products.pageInfo : previousData.products.pageInfo
    return (

        <Page title={"Products"}>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <ResourceList
                            loading={loading}
                            sortValue={searchParams.get('sortValue')}
                            sortOptions={[
                                {label: 'A-Z', value: 'A-Z'},
                                {label: 'Z-A', value: 'Z-A'},
                            ]}
                            onSortChange={(selected) => {
                                changeSortValue(selected)
                                reverseSearch(selected === 'Z-A')

                            }}
                            filterControl={filterControl}
                            showHeader
                            resourceName={{singular: 'product', plural: 'products'}}
                            items={data ? data.products.edges : previousData.products.edges}
                            renderItem={(item) => {
                                const {url} = item
                                const imgNode = item.node.images.edges[0]
                                const id = item.node.id
                                const name = item.node.title
                                const media = (
                                    <Thumbnail
                                        source={imgNode ? imgNode.node.originalSrc : ""}
                                        alt={imgNode ? imgNode.node.altText : ""}
                                    />
                                );
                                const price = item.node.variants.edges[0].node.price
                                const weight = item.node.variants.edges[0].node.weight
                                const idProd = id.substr(22, id.length)

                                return (
                                    <ResourceItem id={id}
                                                  url={url}
                                                  media={media}
                                                  accessibilityLabel={`View details for ${name}`}
                                                  name={name}
                                                  onClick={() => {

                                                      let path = `/EditProductPage/${idProd}`;
                                                      navigate(path);
                                                  }}
                                    >
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
                                        {/*<div>{id}</div>*/}
                                    </ResourceItem>
                                );
                            }}

                        />
                        <Button
                            primary
                            loading={loading}
                            fullWidth={true}
                            onClick={routeAddProduct}
                        >
                            Add new product
                        </Button>
                    </Card>

                    <Pagination
                        hasPrevious={paginationInfo.hasPreviousPage}
                        onPrevious={previousPage}
                        hasNext={paginationInfo.hasNextPage}
                        onNext={nextPage}
                    />
                </Layout.Section>
            </Layout>
        </Page>
    );

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'taggedWith1':
                return `Tagged with ${value}`;
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
}

