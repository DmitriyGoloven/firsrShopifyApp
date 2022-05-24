import {connect} from "react-redux";

import {createStructuredSelector} from "reselect";
import {activePage} from "../../store/reducer/selectors";
import NavigationBar from "./NavigationBar";
import {setActivePage} from "../../store/reducer/actions";

const mapStateToProp = createStructuredSelector({
    activePage
})
const mapDispatchToProps = {
    setActivePage
}


export default connect(mapStateToProp,mapDispatchToProps)(NavigationBar);