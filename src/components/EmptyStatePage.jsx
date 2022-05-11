import { useState } from "react";
import { Page, Layout, EmptyState } from "@shopify/polaris";
import { ResourcePicker, TitleBar} from "@shopify/app-bridge-react";

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export function EmptyStatePage({ setSelection }) {
    // console.log("selection = 0, start EmptyStatePage")
    const [open, setOpen] = useState(false);
console.log(open)
    const handleSelection = (resources) => {
        setOpen(false);
        setSelection(resources.selection.map((product) => product.id));
    };
    return (
        <Page>
            <TitleBar
                primaryAction={{
                    content: "Select products",
                    onAction: () => setOpen(true),
                }}
            />


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



// import { Page, Layout, EmptyState } from "@shopify/polaris";
// const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";
// export function EmptyStatePage() {
//     return (
//         <Page>
//             <Layout>
//                 <Layout.Section>
//                     <EmptyState
//                         heading="Discount your products temporarily"
//                         action={{
//                             content: "Select products",
//                             onAction: () => setOpen(true),
//                         }}
//                         image={img}
//                         imageContained
//                     >
//                         <p>Select products to change their price temporarily.</p>
//                     </EmptyState>
//                 </Layout.Section>
//             </Layout>
//         </Page>
//     );
// }