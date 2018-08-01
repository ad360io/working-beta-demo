/*
Core Libs
*/
import React, { Component } from 'react';
import { connect }          from 'react-redux';

/*
Local CSS
*/
import './MarketplaceListings.component.css';

/*
Children Component
*/
import ListingCard from './ListingCard/ListingCard.component';


/**
 * Marketplace Listings contains array of Listing Cards
 * Filtering of data is done here, which isn't ideal
 *         Future Task: * auto load on scroll should happen here
 */
class MarketplaceListings extends Component {

    constructor(props){
        super(props);
        this.decideDataToDisplay = this.decideDataToDisplay.bind(this);
        this.decideTitle = this.decideTitle.bind(this);
    }

    /** 
     * Decide which fake dataset we are displaying based on mode.
     * Advertisers should see adspaces
     * Publishers should see advertisements posted
     */
    decideDataToDisplay() {
        if(this.props.modeFilter === 'Advertiser'){
            return this.props.contentSpaceListings;
        }else{
            return this.props.requestListings; 
        }
    }

    /** 
     * Filter the datasets with currencyFilter, budgetFilter, and adFormatFilter
     * Remember to ignore adFormatFilter if it is Show All
     * @param {Array} data The full array of listings waiting to be filtered
     */
    filterDataWithProps(data){
        if(this.props.modeFilter === 'Advertiser' ){
            // we are looking at content spaces, with price and currency
            return data.filter((listing)=>{
                if(listing.currency.toUpperCase() === this.props.currencyFilter
                    && listing.price <= (this.props.budgetFilter * 1000)
                    && (this.props.adFormatFilter === 'Show All' 
                    || listing.type === this.props.adFormatFilter)){
                    return listing;
                }else{
                    return null;
                }})
        }else{
            // we are looking at requests
            return data.filter((listing)=>{
                if(listing.currency.toUpperCase() === this.props.currencyFilter
                    && (this.props.adFormatFilter === 'Show All' || listing.type === this.props.adFormatFilter)){
                    return listing;
                }else{
                    return null;
                }})
        }
        
    }

    /**
     * Display Title of Listings Component
     * Purely for presentational purposes 
     * @param {Number} listingSize size of the listing array after filtering
     */
    decideTitle(listingSize){
        const listingType = (this.props.modeFilter === 'Advertiser' ? 'Content Spaces' : 'Contents');
        const isEmpty = (listingSize > 0 ? '' : 'No ' )
        return isEmpty + listingType + ' Available';
    }

    render() {
        const displayData = this.filterDataWithProps(this.decideDataToDisplay());
        
        return <div className='marketplace-listings-container' ref={(ref) => this._containerDiv = ref}>
            <h2 className='marketplace-title'>{this.decideTitle(displayData.length)}</h2>
            {
                displayData.map((listing, i)=>{
                    return <ListingCard key={'listingCard'+i} listing={listing} modeFilter={this.props.modeFilter}/>
                })
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        currencyFilter       : state.MenuBarFilterReducer.currencyFilter,
        modeFilter           : state.MenuBarFilterReducer.modeFilter,
        budgetFilter         : state.MarketplaceFilterReducer.budgetFilter,
        adFormatFilter       : state.MarketplaceFilterReducer.adFormatFilter,
        contentSpaceListings : state.MarketplaceDataReducer.db.contentSpaceListings,
        requestListings      : state.MarketplaceDataReducer.db.requestListings
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MarketplaceListings);