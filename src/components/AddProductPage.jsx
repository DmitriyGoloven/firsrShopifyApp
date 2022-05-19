import {useCallback, useEffect, useState} from "react";
import {Form, TextField, Button, FormLayout, Page, Banner} from "@shopify/polaris";
import {Loading, Toast, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate} from "react-router-dom";
import {ButtonGroup, DisplayText} from "@shopify/polaris";
import {gql, useMutation, useQuery} from "@apollo/client";

const ADD_PRODUCT = gql`
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


export function AddProductPage() {

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });


    const [addProduct, {loading, error, data}] = useMutation(ADD_PRODUCT)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const handleSubmit = useCallback(() => {

        addProduct(({
            variables: {
                input: {
                    title: title,
                    descriptionHtml: description
                },
            },
        }))
    }, [title, description]);

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    const handleTitleChange = useCallback((value) => setTitle(value), [title]);
    const handleDescriptionChange = useCallback((value) => setDescription(value), [description],);

    const routeProducts = () => {
        let path = `/ProductsPage`;
        navigate(path);
    }
    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }
    if (loading) return <Loading/>
    if (data) return <Toast
        content="Product created!🎉"
        onDismiss={routeProducts}
    />


    return (

        <Page title={"Creation of a new product:"}>
            <Form onSubmit={handleSubmit}>
                <FormLayout>

                    <TextField
                        value={title}
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
                        value={description}
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
                        <Button submit disabled={title ? false : true}
                                primary>Save product</Button>
                    </ButtonGroup>

                </FormLayout>
            </Form>

        </Page>

    );
}


