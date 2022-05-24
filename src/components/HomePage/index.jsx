import {connect} from "react-redux";

import {createStructuredSelector} from "reselect";
import {HomePage} from "./HomePage";
import {getProductCount} from "../../store/reducer/actions";
import {productCount} from "../../store/reducer/selectors";

const mapStateToProp = createStructuredSelector({
    productCount
})

const mapDispatchToProps = {
    getProductCount,

}

export default connect(mapStateToProp, mapDispatchToProps)(HomePage);