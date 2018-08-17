/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withWindowWidthListener } from '../../ResponsiveComponent/ResponsiveComponent';

/*
React Bootstrap Components
*/
import { Button } from 'react-bootstrap';

/*
Material UI Components
*/
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

/*
Action
*/
import { openDrawer, closeDrawer, drawerRequest, setKeyword } from '../../../actions/MarketplaceActions';

/*
Local CSS
*/
import './MarketplaceFilter.component.css';

/*
Children Components
*/
import ViewModeSelector from './ViewModeSelector/ViewModeSelector.component';
import AdFormatFilter from './AdFormatFilter/AdFormatFilter.component';
import PurchaseRangeSelector from './PurchaseRangeSelector/PurchaseRangeSelector.component';
import KeywordFilter from './KeywordFilter/KeywordFilter.component';
import SortingSelector from './SortingSelector/SortingSelector.component';


/**
 * MarketplaceFilter Component
 */
class MarketplaceFilter extends Component {

    constructor(props) {
        super(props)

        // function binding
        this.decideTitle = this.decideTitle.bind(this);
        this.decideHidden = this.decideHidden.bind(this);
        this.onWindowWidthUpdate = this.onWindowWidthUpdate.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    onWindowWidthUpdate() {
        // Dynamically close the drawer for small screen
        //             open  the drawer for medium to big screen

    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        if (window.innerWidth <= 768) {
            this.props.closeDrawer();
        }
        else {
            this.props.openDrawer();
        }
    }

    decideTitle() {
        if (this.props.modeFilter === 'Advertiser') return 'Content Spaces';
        else return 'Content'
    }

    decideHidden() {
        if (this.props.width <= 768) {
            return 'none';
        } else {
            return 'inline-block';
        }
    }

    render() {
        return <div className='marketplace-filter-container' >
            <Button
                className='btn-open-filter-drawer'
                hidden={this.props.width > 768}
                onClick={() => this.props.openDrawer()}
            >
                Click Me to Set Filters
            </Button>
            <Drawer
                docked={this.props.width > 768}
                width={300}
                zDepth={1}
                open={this.props.isDrawerOpen}
                onRequestChange={this.props.onDrawerRequestChange}
                className='filter-drawer'
            >
                <Paper style={{
                    height: 64,
                    width: 300,
                    margin: 0,
                    display: 'inline-block',
                }} zDepth={0} />

                <h4 className='filter-title'>View Mode</h4>
                <ViewModeSelector decideHidden={this.decideHidden} style={{ marginBotton: '5%' }} />
                <FilterDivider />

                <h4 className='filter-title'>{this.decideTitle()} Listings</h4>
                <AdFormatFilter />
                <FilterDivider />

                <h4 className='filter-title'>Keyword Search</h4>
                <KeywordFilter onChange={this.props.onKeywordChange} />
                <FilterDivider />

                <h4 className='filter-title'>Max Purchase:</h4>
                <PurchaseRangeSelector />
                <FilterDivider />

                <h4 className='filter-title' style={{ textAlign: 'left', marginLeft: '25px' }}>Sort By:</h4>
                <SortingSelector />
                <FilterDivider />
            </Drawer>
        </div>
    }
}

const FilterDivider = () => (
    <Divider style={{ marginTop: '5%' }} />
)

const mapStateToFilterProps = (state) => {
    return {
        isDrawerOpen: state.MarketplaceFilterReducer.isDrawerOpen,
        modeFilter: state.MenuBarFilterReducer.modeFilter,
    }
}

const mapDispatchToFilterProps = (dispatch) => {
    return {
        onDrawerRequestChange: (open) => {
            dispatch(drawerRequest(open))
        },
        closeDrawer: () => {
            dispatch(closeDrawer())
        },
        openDrawer: () => {
            dispatch(openDrawer())
        },
        onKeywordChange: (keyword) => {
            dispatch(setKeyword(keyword));
        }
    }
}


export default withWindowWidthListener(connect(
    mapStateToFilterProps,
    mapDispatchToFilterProps
)(MarketplaceFilter));
