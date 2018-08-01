/*
Core Libs
*/
import React from 'react';
import { connect } from 'react-redux';

/*
Search Input
*/
import SearchInput from 'react-search-input';

/*
Local CSS
*/
import './KeywordFilter.component.css';


const KeywordFilter = ({onChange}) => (
    <div className='keyword-filter-container'>
        <SearchInput className='search-input' onChange={onChange} />
    </div>
)

const mapStateToProps = (state) => {
    return {
       
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KeywordFilter);