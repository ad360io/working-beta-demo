/*
Core Libs
*/
import React from 'react';
import { connect } from 'react-redux';

/*
React Bootstrap
*/
import { FormGroup, FormControl } from 'react-bootstrap';

/*
Children Components
*/
import AvailabilityPicker from './AvailabilityPicker/AvailabilityPicker.component';
import AdFormatSelect     from './AdFormatSelect/AdFormatSelect.component';


const RequiredFormField = ({ modeFilter,
                             from,
                             to,
                             onTopicChange, 
                             onDescriptionChange,
                             onPriceChange
                            }) => (<div style={{marginLeft: '2%', marginTop: '2%'}}>
        <FormGroup hidden={modeFilter === 'Advertiser'}>
            <p className='control-label'>
                Select Promotion Duration
            </p>
            <AvailabilityPicker from={from} to={to} />
        </FormGroup>

        <AdFormatSelect modeFilter={modeFilter}/>

        <FormGroup controlId='control-form-topic'>
            <p className='control-label'>
                Content Topic
                    </p>
            <FormControl type='text' onChange={onTopicChange} required />
        </FormGroup>

        <FormGroup controlId='control-form-price' hidden={modeFilter === 'Advertiser'}>
            <p className='control-label'>
                Price per time unit (day/week/month/year)
                    </p>
            <FormControl type='number' min='1' step='1' onChange={onPriceChange} style={{ width: '50%', float: 'left' }} />
            <FormControl componentClass='select' style={{ width: '50%' }} required>
                <option value='day'>per day</option>
                <option value='week'>per week</option>
                <option value='month'>per month</option>
                <option value='year'>per year</option>
            </FormControl>

        </FormGroup>

        <FormGroup controlId='control-form-pitch'>
            <p className='control-label'>
            {
                modeFilter === 'Advertiser'
                    ? "Content Description"
                    : "Listing Description"
            }
            </p>
            <FormControl componentClass='textarea'
                maxLength={280}
                rows={8}
                style={{ resize: 'vertical' }}
                onChange={onDescriptionChange}
                required
            />
        </FormGroup>
    </div>
)

const mapStateToProps = (state) => {
    return {
        from : state.CreateListingFormReducer.publisherForm.dateFrom,
        to   : state.CreateListingFormReducer.publisherForm.dateTo
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const { modeFilter } = ownProps;
    return {
        onDescriptionChange: (event) => {
            if(modeFilter === 'Advertiser'){
                dispatch({
                    type: 'SET_ADV_FORM_DESCRIPTION',
                    description: event.target.value
                })
            }else {
                dispatch({
                    type: 'SET_PUB_FORM_DESCRIPTION',
                    description: event.target.value
                })
            }
            
        },
        onTopicChange: (event) => {
            if(modeFilter === 'Advertiser'){
                dispatch({
                    type: 'SET_ADV_FORM_TOPIC',
                    topic: event.target.value
                })
            }else {
                dispatch({
                    type: 'SET_PUB_FORM_TOPIC',
                    topic: event.target.value
                })
            }
        },
        onPriceChange: (event) => {
            dispatch({
                type: 'SET_PUB_FORM_PRICE',
                price: event.target.value,
            })
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequiredFormField);