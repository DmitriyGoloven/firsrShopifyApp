import {gql, useLazyQuery, useQuery} from "@apollo/client";
import {Page, Layout, Banner, Card, Pagination} from "@shopify/polaris";
import {Loading} from "@shopify/app-bridge-react";
import {ProductsList} from "./ProductsList";
import {useCallback, useEffect, useMemo} from "react";


const GET_PRODUCTS = gql`
  query GetProducts($count: Int) {
  products(first: $count) {
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

export function ProductsPagePagination() {
    const PRODUCTS_COUNT = 3
     const [getProducts, {loading, error, data}] = useLazyQuery(GET_PRODUCTS)

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



    console.log(data)

    const nextPage = () => {
        getProducts({
            variables: {
                count: 5

            }
        });
    }
        const previousPage = () => {
            getProducts({
                variables: {
                    count: 2
                }
            });
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
                        <ProductsList data={data}/>
                    </Card>

                </Layout.Section>
            </Layout>
        </Page>
    );
}

