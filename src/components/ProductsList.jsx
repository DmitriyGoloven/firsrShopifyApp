import {ResourceList, TextStyle, Stack, Thumbnail, ResourceItem, Card} from "@shopify/polaris";
import {useCallback, useEffect, useMemo, useState} from "react";


export function ProductsList({data, getProducts}) {

    const [sortValue, setSortValue] = useState('A-Z')

    useEffect(() => {
        if (sortValue === 'A-Z') {
            getProducts({
                variables: {
                    revers: false,
                }
            })
        } else {
            getProducts({
                variables: {
                    revers: true,
                }
            })
        }

        console.log(sortValue)
    }, [sortValue])

    return (
        <Card>
            <ResourceList
                sortValue={sortValue}
                sortOptions={[
                    {label: 'A-Z', value: 'A-Z'},
                    {label: 'Z-A', value: 'Z-A'},
                ]}
                onSortChange={(selected) => {
                    setSortValue(selected);
                }}
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
