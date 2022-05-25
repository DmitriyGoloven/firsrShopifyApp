import {connect} from "react-redux";

import {createStructuredSelector} from "reselect";
import {HomePage} from "./HomePage";
import {
    getProductCount,
    getPublishedProducts,
    getUnPublishedProducts,
    setActivePage
} from "../../store/reducer/actions";
import {activePage, productCount, productsPublished, productsUnPublished} from "../../store/reducer/selectors";

const mapStateToProp = createStructuredSelector({
    productCount,
    productsPublished,
    productsUnPublished,
    activePage
})

const mapDispatchToProps = {
    setActivePage,
    getProductCount,
    getPublishedProducts,
    getUnPublishedProducts

}

export default connect(mapStateToProp, mapDispatchToProps)(HomePage);