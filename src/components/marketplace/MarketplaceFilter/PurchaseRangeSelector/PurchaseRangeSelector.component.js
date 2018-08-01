/*
Core Libs
*/
import React from 'react';
import { connect } from 'react-redux';

/*
Material UI 
*/
import Slider from 'material-ui/Slider';

/*
Actions
*/
import { setBudget } from '../../../../actions/MarketplaceActions';

/*
Local CSS
*/
import './PurchaseRangeSelector.component.css';


const PurchaseRangeSelector = ({budgetFilter, currencyFilter, onSliderChange}) => (
    <div className='range-selector'>
        <Slider className='range-slider'
            onChange={onSliderChange}
            value={budgetFilter}
            min={0.1}
            max={10}
            step={0.1} />
        <h4 className='budget-value'> {budgetFilter} k {currencyFilter}</h4>
    </div>
)

const mapStateToProps = (state) => {
    return {
        budgetFilter       : state.MarketplaceFilterReducer.budgetFilter,
        currencyFilter     : state.MenuBarFilterReducer.currencyFilter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSliderChange:(event, budgetFilter)=>{
            dispatch(setBudget(budgetFilter))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PurchaseRangeSelector);