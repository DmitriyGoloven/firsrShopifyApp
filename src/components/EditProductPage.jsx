import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Banner, Button, ButtonGroup,
    Form,
    FormLayout,
    Page,
    TextField,
} from "@shopify/polaris";
import {useLocation, useParams, useNavigate, useSearchParams} from "react-router-dom";
import {Loading, Toast, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {gql, useMutation, useQuery} from "@apollo/client";

const EDIT_PRODUCT = gql`
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

const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        product(id: $id) {
            title
            descriptionHtml
        }
    }
`;

const EditProductPage = () => {

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const params = useParams();
    const prodId = params.id;

    const {loading, error, data} = useQuery(GET_PRODUCT, {
        variables: {
            id: `gid://shopify/Product/${prodId}`
        }
    });
    const [productUpdate, {loading: loadingP, error: errorP, data: dataP}] = useMutation(EDIT_PRODUCT)

    const [searchParams, setSearchParams] = useSearchParams({title: "", descriptionHtml: ""})
    const [previousData, setPreviousData] = useState({title: "", descriptionHtml: ""});

    useEffect(() => {
        if (data) {
            setSearchParams({title: data.product.title, descriptionHtml: data.product.descriptionHtml})
            setPreviousData({title: data.product.title, descriptionHtml: data.product.descriptionHtml})
        }
    }, [data])

    const handleSubmit = useCallback(() => {

        productUpdate({
            variables: {
                input: {
                    id: `gid://shopify/Product/${prodId}`,
                    title: searchParams.get("title"),
                    descriptionHtml: searchParams.get("descriptionHtml"),
                }
            }
        })

    }, [searchParams]);


    const handleTitleChange = useCallback((value) => {
        setSearchParams(
            {title: value, descriptionHtml: searchParams.get("descriptionHtml")})
    }, [searchParams]);

    const handleDescriptionChange = useCallback((value) => {
        setSearchParams(
            {descriptionHtml: value, title: searchParams.get("title")})
    }, [searchParams]);

    const routeProducts = () => {
        let path = `/ProductsPage`;
        navigate(path);
    }
    if (error || errorP) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }
    if (loading || loadingP) return <Loading/>
    if (dataP) {
        return <Toast
            content="Product edited!🎉"
            onDismiss={routeProducts}
        />
    }


    return (

        <Page title={"Edit a product:"}>
            <Form onSubmit={handleSubmit} loading={loadingP}>
                <FormLayout>
                    <TextField
                        value={searchParams.get("title")}
                        onChange={handleTitleChange}
                        label="Title"
                        type="text"
                        helpText={
                            <span>
              Product title
            </span>
                        }
                    />
                    <TextField
                        value={searchParams.get("descriptionHtml")}
                        onChange={handleDescriptionChange}
                        label="Description"
                        type="text"
                        helpText={
                            <span>
              Product description
            </span>
                        }
                    />
                    <ButtonGroup spacing="loose">
                        <Button onClick={routeProducts}>Back</Button>
                        <Button submit disabled={(previousData.title === searchParams.get("title")) &&
                        (previousData.descriptionHtml === searchParams.get("descriptionHtml"))}
                                primary>Save product</Button>
                    </ButtonGroup>
                </FormLayout>
            </Form>
        </Page>
    );
}

export default EditProductPage;