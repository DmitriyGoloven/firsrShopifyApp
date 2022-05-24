import React, {useCallback, useEffect, useState} from 'react';
import {
    Banner, Button, ButtonGroup,
    Form,
    FormLayout,
    Page,
    TextField,
} from "@shopify/polaris";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import {Loading, Toast, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {EDIT_PRODUCT, GET_PRODUCT} from "../GqlRequests/GqlRequests";

const EditProductPage = ({setActivePage, activePage}) => {

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace: navigate
    });

    useEffect(() => setActivePage("Products Page / Edit Product"), [activePage])

    const params = useParams();
    const prodId = params.id;

    const {loading, error, data} = useQuery(GET_PRODUCT, {
        variables: {
            id: `gid://shopify/Product/${prodId}`
        }
    });
    const [productUpdate, {loading: loadingP, error: errorP, data: dataP}] = useMutation(EDIT_PRODUCT)


    const [searchParams, setSearchParams] = useState({title: "", descriptionHtml: ""})
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
                    title: searchParams.title,
                    descriptionHtml: searchParams.descriptionHtml,
                }
            }
        })

    }, [searchParams]);


    const handleTitleChange = useCallback((value) => {
        setSearchParams(
            {title: value, descriptionHtml: searchParams.descriptionHtml})
    }, [searchParams]);

    const handleDescriptionChange = useCallback((value) => {
        setSearchParams(
            {descriptionHtml: value, title: searchParams.title})
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
                        value={searchParams.title}
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
                        value={searchParams.descriptionHtml}
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
                        <Button submit disabled={(previousData.title === searchParams.title) &&
                        (previousData.descriptionHtml === searchParams.descriptionHtml)}
                                primary>Save product</Button>
                    </ButtonGroup>
                </FormLayout>
            </Form>
        </Page>
    );
}

export default EditProductPage;