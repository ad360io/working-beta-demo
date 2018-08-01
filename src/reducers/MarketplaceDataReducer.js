// Initial state
const initialState = {
    fetching: false,
    fetched: false,
    hasError: false,
    db: {
        requestListings : [],
        contentSpaceListings : [],
    },
    viewingId: null,
    error: null
}


/**
 *  Core database reducer.
 *  Fetches data from the database and updates the state.
 */
const MarketplaceDataReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'FETCH_MARKETPLACE_DATA_PENDING': {
            return {
                ...state,
                fetching: true
            }
        }
        case 'FETCH_MARKETPLACE_DATA_REJECTED': {
            return {
                ...state,
                fetching: false,
                error: action.payload,
                hasError: true,
            }
        }
        case 'FETCH_MARKETPLACE_DATA_FULFILLED': {
            return {
                ...state,
                fetching: false,
                fetched: true,
                hasError: false,
                db: {
                    requestListings : action.payload.filter(requestListing => requestListing.classtype === 'request'),
                    contentSpaceListings: action.payload.filter(contentSpaceListing => contentSpaceListing.classtype === 'listing')
                },
            }
        }

        case 'SET_VIEWING_ID': {
            return {
                ...state,
                viewingId: action.viewingId
            }
        }

        case 'CLOSE_LISTING': {
            return {
                ...state,
                viewingId: null
            }
        }
        default:
            return state;
    }
}

export default MarketplaceDataReducer;
