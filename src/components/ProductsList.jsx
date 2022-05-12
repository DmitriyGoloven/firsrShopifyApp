import {ResourceList, TextStyle, Stack, Thumbnail, ResourceItem, Card} from "@shopify/polaris";


export function ProductsList({data}) {
    console.log(data)

    return (

        <Card>

            <ResourceList
                showHeader

                resourceName={{singular: 'product', plural: 'products'}}
                items={data.products.edges}
                renderItem={(item) => {

                    const media = (
                        <Thumbnail
                            source={
                                item.node.images.edges[0] ? item.node.images.edges[0].node.originalSrc : ""
                            }
                            alt={item.node.images.edges[0] ? item.node.images.edges[0].node.altText : ""}
                        />
                    );

                    const price = item.node.variants.edges[0].node.price
                    const weight = item.node.variants.edges[0].node.weight
                    return (

                        <ResourceItem id={item} media={media}>
                            <h3>
                                <TextStyle variation="strong">{item.node.title}</TextStyle>
                            </h3>

                            <Stack distribution="fillEvenly">

                                <Stack.Item fill>
                                    <h3>
                                        <TextStyle>{item.node.status}</TextStyle>
                                    </h3>
                                </Stack.Item>

                                <Stack.Item>
                                    <p>weight: {weight}</p>
                                </Stack.Item>

                                <Stack.Item>
                                    <p>price: ${price}</p>
                                </Stack.Item>

                            </Stack>
                        </ResourceItem>
                    );
                }}
            />

        </Card>

    );
}
