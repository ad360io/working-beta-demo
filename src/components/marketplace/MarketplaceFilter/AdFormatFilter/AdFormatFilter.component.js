/*
Core Libs
*/
import React from 'react';
import { connect } from 'react-redux';

/*
Local CSS
*/
import './AdFormatFilter.component.css';

/*
Actions
*/
import { setAdFormat } from '../../../../actions/MarketplaceActions';

/*
React Bootstrap
*/
import { Button, SplitButton, MenuItem } from 'react-bootstrap';


const AdFormatFilter = ({onAdFormatClick, adFormatFilter}) => (
    <div>
        <Button
            className='btn-marketing-type'
            onClick={() => {onAdFormatClick('Show All')}}
            active={adFormatFilter === 'Show All'}
        >
            Show All
        </Button>
        <SplitButton
            className='split-btn-marketing-type'
            title='Branded Content'
            id='branded-content-menu'
            pullRight
            onClick={() => onAdFormatClick('Branded Content')}
            active={adFormatFilter === 'Branded Content'}
        >
            <MenuItem >Written Piece</MenuItem>
            <MenuItem >Audio Piece</MenuItem>
            <MenuItem >Video Piece</MenuItem>
        </SplitButton>
        <SplitButton
            className='split-btn-marketing-type'
            title='Influencer Post'
            id='influencer-post-menu'
            pullRight
            onClick={() => onAdFormatClick('Influencer Post')}
            active={adFormatFilter === 'Influencer Post'}
        >
            <MenuItem >Tweet</MenuItem>
            <MenuItem >Instagram</MenuItem>
            <MenuItem >Twitch</MenuItem>
            <MenuItem >Youtube</MenuItem>
            <MenuItem >Facebook</MenuItem>
            <MenuItem >Twitter</MenuItem>
            <MenuItem >NicoNico</MenuItem>
        </SplitButton>
        <Button
            className='btn-marketing-type'
            onClick={() => onAdFormatClick('Sponsorship')}
            active={adFormatFilter === 'Sponsorship'}
        >
            Sponsorship
        </Button>
        <SplitButton
            className='split-btn-marketing-type'
            title='Patron Journalism'
            id='branded-content-menu'
            pullRight
            onClick={() => onAdFormatClick('Patron Journalism')}
            active={adFormatFilter === 'Patron Journalism'}
        >
            <MenuItem >Written Piece</MenuItem>
            <MenuItem >Audio Piece</MenuItem>
            <MenuItem >Video Piece</MenuItem>
        </SplitButton>
    </div>
)

const mapStateToProps = (state) => {
    return {
        adFormatFilter: state.MarketplaceFilterReducer.adFormatFilter,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAdFormatClick: (adFormat) => {
            dispatch(setAdFormat(adFormat))
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdFormatFilter)