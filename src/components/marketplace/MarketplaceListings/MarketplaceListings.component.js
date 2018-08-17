/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createFilter } from 'react-search-input';

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

    constructor(props) {
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
        if (this.props.modeFilter === 'Advertiser') {
            return this.props.contentSpaceListings;
        } else {
            return this.props.requestListings;
        }
    }

    /** 
     * Filter the datasets with currencyFilter, budgetFilter, and adFormatFilter
     * Remember to ignore adFormatFilter if it is Show All
     * @param {Array} data The full array of listings waiting to be filtered
     */
    filterDataWithProps(data) {
        const KEYS_TO_FILTER = ['name', 'owner_name', 'description', 'ad_format', 'medium'];
        const keywordFilteredData = data.filter(createFilter(this.props.keywordFilter, KEYS_TO_FILTER));
        if (this.props.modeFilter === 'Advertiser') {
            // we are looking at content spaces, with price and currency
            return keywordFilteredData.filter((listing) => {
                if (listing.currency.toUpperCase() === this.props.currencyFilter
                    && listing.price <= (this.props.budgetFilter * 1000)
                    && (this.props.adFormatFilter === 'Show All' || listing.ad_format === this.props.adFormatFilter)
                    && (this.props.mediumFilter === '' || listing.medium === this.props.mediumFilter)) {
                    return listing;
                } else {
                    return null;
                }
            })
        } else {
            // we are looking at requests
            return keywordFilteredData.filter((listing) => {
                if (listing.currency.toUpperCase() === this.props.currencyFilter
                    && (this.props.adFormatFilter === 'Show All' || listing.ad_format === this.props.adFormatFilter)
                    && (this.props.mediumFilter === '' || listing.medium === this.props.mediumFilter)) {
                    return listing;
                } else {
                    return null;
                }
            })
        }

    }

    /**
     * Display Title of Listings Component
     * Purely for presentational purposes 
     * @param {Number} listingSize size of the listing array after filtering
     */
    decideTitle(listingSize) {
        const listingType = (this.props.modeFilter === 'Advertiser' ? 'Content Spaces' : 'Contents');
        const isEmpty = (listingSize > 0 ? '' : 'No ')
        return isEmpty + listingType + ' Available';
    }

    render() {
        const displayData = this.filterDataWithProps(this.decideDataToDisplay());

        return <div className='marketplace-listings-container' ref={(ref) => this._containerDiv = ref}>
            <h3 className='marketplace-title'>{this.decideTitle(displayData.length)}</h3>
            {
                displayData.map((listing, i) => {
                    return <ListingCard key={'listingCard' + i} listing={listing} modeFilter={this.props.modeFilter} />
                })
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        currencyFilter: state.MenuBarFilterReducer.currencyFilter,
        modeFilter: state.MenuBarFilterReducer.modeFilter,
        budgetFilter: state.MarketplaceFilterReducer.budgetFilter,
        adFormatFilter: state.MarketplaceFilterReducer.adFormatFilter,
        mediumFilter: state.MarketplaceFilterReducer.mediumFilter,
        contentSpaceListings: state.MarketplaceDataReducer.db.contentSpaceListings,
        requestListings: state.MarketplaceDataReducer.db.requestListings,
        keywordFilter: state.MarketplaceFilterReducer.keywordFilter,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MarketplaceListings);