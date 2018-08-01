const fetch_DashboardData_Pending = () => {
    return {
        type: 'FETCH_DASHBOARD_DATA_PENDING'
    }
}

const fetch_DashboardData_Fulfilled = (data) => {
    return {
        type: 'FETCH_DASHBOARD_DATA_FULFILLED',
        payload: data
    }
}

const fetch_DashboardData_Rejected = (err) => {
    return {
        type: 'FETCH_DASHBOARD_DATA_REJECTED',
        payload: err
    }
}

const fetch_MarketplaceData_Pending = () => {
    return {
        type: 'FETCH_MARKETPLACE_DATA_PENDING'
    }
}

const fetch_MarketplaceData_Fulfilled = (data) => {
    return {
        type: 'FETCH_MARKETPLACE_DATA_FULFILLED',
        payload: data
    }
}

const fetch_MarketplaceData_Rejected = (err) => {
    return {
        type: 'FETCH_MARKETPLACE_DATA_REJECTED',
        payload: err
    }
}


export { 
    fetch_DashboardData_Pending, 
    fetch_DashboardData_Fulfilled, 
    fetch_DashboardData_Rejected,
    fetch_MarketplaceData_Pending, 
    fetch_MarketplaceData_Fulfilled, 
    fetch_MarketplaceData_Rejected,
} 