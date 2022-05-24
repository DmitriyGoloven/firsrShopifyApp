import {connect} from "react-redux";

import {createStructuredSelector} from "reselect";
import {HomePage} from "./HomePage";
import {getProductCount, setActivePage} from "../../store/reducer/actions";
import {activePage, productCount} from "../../store/reducer/selectors";

const mapStateToProp = createStructuredSelector({
    productCount,
    activePage
})

const mapDispatchToProps = {
    getProductCount,
    setActivePage

}

export default connect(mapStateToProp, mapDispatchToProps)(HomePage);