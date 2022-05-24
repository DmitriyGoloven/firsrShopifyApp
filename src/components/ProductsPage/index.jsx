import {connect} from "react-redux";


import {ProductsPage} from "./ProductsPage";
import {setActivePage} from "../../store/reducer/actions";
import {createStructuredSelector} from "reselect";
import {activePage} from "../../store/reducer/selectors";

const mapStateToProp = createStructuredSelector({
    activePage
})
const mapDispatchToProps = {
    setActivePage
}


export default connect(mapStateToProp,mapDispatchToProps)(ProductsPage);