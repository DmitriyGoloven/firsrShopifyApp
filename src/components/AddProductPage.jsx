import {useCallback, useState} from "react";
import {Form, TextField, Button, FormLayout, Checkbox, Page} from "@shopify/polaris";
import {useClientRouting, useNavigate, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation} from "react-router-dom";
import {ButtonGroup, DisplayText} from "@shopify/polaris";
import {gql, useQuery} from "@apollo/client";

// const ADD_PRODUCT = gql`
  // mutation populateProduct($input: ProductInput!) {
  //   productCreate(input: $input) {
  //     product {
  //       title
  //     }
  //   }
  // }
// `;


export function AddProductPage() {

    let location = useLocation();
    useRoutePropagation(location);

    let navigate = useNavigate();
    useCallback(() => useClientRouting({
        replace: (path) => {
            navigate(path)
        }
    }), [])

    // const [addProducts, {loading, error, data}] = useQuery(ADD_PRODUCT)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = useCallback((_event) => {
        console.log(_event);
    }, []);


    const handleTitleChange = useCallback((value) => setTitle(value), []);
    const handleDescriptionChange = useCallback((value) => setDescription(value), [],);

    const viewProducts = () => {
        let path = `/ProductsPage`;
        navigate(path);
    }

    return (
        <Page>
            <DisplayText size="medium">
            Creation of a new product:
                </DisplayText>
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
                        <Button onClick={viewProducts}>View products</Button>
                        <Button submit primary>Save product</Button>
                        </ButtonGroup>


                        {/*<Button submit>Save product</Button>*/}
                </FormLayout>
            </Form>

        </Page>

);
}


