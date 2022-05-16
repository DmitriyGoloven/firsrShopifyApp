import { useState } from "react";
import { Page, Layout, EmptyState } from "@shopify/polaris";
import {ResourcePicker, TitleBar, useClientRouting, useNavigate, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation} from "react-router-dom";


const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export function EmptyStatePage({ setSelection }) {

    let location = useLocation();
    useRoutePropagation(location);

    // let navigate = useNavigate();
    // useClientRouting({
    //     replace: navigate
    // })

    const [open, setOpen] = useState(false);

    const handleSelection = (resources) => {

        setOpen(false);
        setSelection(resources.selection.map((product) => product.id));
    };
    return (
        <Page>

            <ResourcePicker // Resource picker component
                resourceType="Product"
                showVariants={true}
                open={open}
                onSelection={(resources) => handleSelection(resources)}
                onCancel={() => setOpen(false)}
            />
            <Layout>
                <EmptyState
                    heading="Discount your products temporarily"
                    action={{
                        content: "Select products",
                        onAction: () => setOpen(true),
                    }}
                    image={img}
                    imageContained
                >
                    <p>Select products to change their price temporarily.</p>
                </EmptyState>
            </Layout>
        </Page>
    );
}


