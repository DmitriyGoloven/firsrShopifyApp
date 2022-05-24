import {gql} from "@apollo/client";

export const GET_PRODUCTS = gql`
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

export const ADD_PRODUCT = gql`
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        title
        descriptionHtml
        id
      
      }
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
        title
        descriptionHtml
        id

      }
    }
  }
`;

export const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        product(id: $id) {
            title
            descriptionHtml
        }
    }
`;