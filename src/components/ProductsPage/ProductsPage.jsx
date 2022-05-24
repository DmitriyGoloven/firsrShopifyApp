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
import {GET_PRODUCTS} from "../GqlRequests/GqlRequests";


const PRODUCTS_COUNT = 3

export function ProductsPage({setActivePage, activePage}) {

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace: navigate
    });

    useEffect(() => setActivePage("Products Page"), [activePage])


    const [getProducts, {loading, error, data, previousData}] = useLazyQuery(GET_PRODUCTS)

    const [searchParams, setSearchParams] = useSearchParams({
        revers: false, sortValue: "A-Z", queryValue: "", tagged: "",
        count: PRODUCTS_COUNT, countLast: null, startCursor: null, endCursor: null,
    })

    //Change sort,filters search params

    const handleTaggedWithChange = useCallback((value) => {
        setSearchParams({
            tagged: value, queryValue: searchParams.get("queryValue"),
            sortValue: searchParams.get("sortValue")
        })
    }, [searchParams],);

    const changeSortValue = useCallback((sortValue) => {
        setSearchParams({
            queryValue: searchParams.get("queryValue"), sortValue: sortValue,
            tagged: searchParams.get("tagged")
        })
    }, [searchParams])

    const changeSearch = useCallback((queryValue) => {
        setSearchParams({
            sortValue: searchParams.get("sortValue"), queryValue: queryValue,
            tagged: searchParams.get("tagged")
        })
    }, [searchParams])

    const querySearch = useCallback(() => {
        return searchParams.get("tagged") ?
            `(title:${searchParams.get("queryValue")}*) AND (tag:${searchParams.get("tagged")}*)`
            : searchParams.get("queryValue")
    }, [searchParams])

    // Remove filters actions

    const handleQueryValueRemove = useCallback(() => {
        setSearchParams({
            sortValue: searchParams.get("sortValue"),
            queryValue: "", tagged: searchParams.get("tagged")
        })
    }, [searchParams]);

    const handleTaggedWithRemove = useCallback(() => {
        setSearchParams({sortValue: searchParams.get("sortValue"), tagged: "",});
    }, [searchParams]);


    //Pagination

    const nextPage = useCallback(() => {
        setSearchParams({
            sortValue: searchParams.get("sortValue"),
            endCursor: data.products.pageInfo.endCursor,
            count: searchParams.get("count"),
            queryValue: searchParams.get("queryValue"),
            tagged: searchParams.get("tagged")
        })
    }, [data, searchParams]);

    const previousPage = useCallback(() => {
        setSearchParams({
            sortValue: searchParams.get("sortValue"),
            endCursor: null,
            count: null,
            queryValue: searchParams.get("queryValue"),
            tagged: searchParams.get("tagged"),
            startCursor: data.products.pageInfo.startCursor,
            countLast: PRODUCTS_COUNT,
        })
    }, [data, searchParams]);

    // Request

    let timeout;
    useEffect(() => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            getProducts({
                variables: {
                    revers: searchParams.get("sortValue") === "Z-A",
                    count: searchParams.get("count") === "null" ? null : Number(searchParams.get("count")),
                    search: querySearch(),
                    startCursor: searchParams.get("startCursor") === 'null' ? null : searchParams.get("startCursor"),
                    countLast: searchParams.get("countLast") === 'null' ? null : Number(searchParams.get("countLast")),
                    endCursor: searchParams.get("endCursor") === 'null' ? null : searchParams.get("endCursor"),
                }
            })
        }, 500);
    }, [data, searchParams]);

    //Filters

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

