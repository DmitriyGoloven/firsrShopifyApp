import {connect} from "react-redux";

import {createStructuredSelector} from "reselect";
import EditProductPage from "./EditProductPage";
import {setActivePage} from "../../store/reducer/actions";
import {activePage} from "../../store/reducer/selectors";

const mapStateToProp = createStructuredSelector({
    activePage
})

const mapDispatchToProps = {
    setActivePage

}

export default connect(mapStateToProp, mapDispatchToProps)(EditProductPage);