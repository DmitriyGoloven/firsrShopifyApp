import { gql, useQuery } from "@apollo/client";
import {Page, Layout, Banner, Card} from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import { ProductsList } from "./ProductsList";

const GET_PRODUCTS = gql`
  query GetProducts($count: Int) {
  products(first: $count) {
    edges {
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
  }
}
`;

export function ProductsPageNew() {

    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS, {
        variables: { count: 6 },
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

                    <Card>
                        <ProductsList data={data} />
                    </Card>

                </Layout.Section>
            </Layout>
        </Page>
    );
}

