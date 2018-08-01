/*
Core Libs
*/
import React from 'react';
import { connect } from 'react-redux';

/*
Bootstrap
*/
import { FormGroup, FormControl } from 'react-bootstrap';

/*
Material UI
*/
import Checkbox from 'material-ui/Checkbox';

/*
Local CSS
*/
import './OptionalFormFields.component.css'


const OptionalFormField = ({ modeFilter }) => (
    <div>
        <FormGroup controlId='control-form-image' hidden={modeFilter === 'Publisher'}>
            <p className='control-label'>
                Content Samples and Inspiration (optional)
                    </p>
            <FormControl type='file' />
        </FormGroup>

        <FormGroup controlId='control-form-additional' hidden={modeFilter === 'Advertiser'}>
            <p className='control-label noselect'>
                Additional Services (optional)
                    </p>
            <div style={{ width: '10%', float: 'left', marginTop: '12px' }}>
                <Checkbox color="default" />
            </div>
            <div style={{ width: '90%', height: '48px', marginTop: '9px' }}>Banner</div>

            <div style={{ width: '10%', float: 'left', marginTop: '12px' }}>
                <Checkbox color="default" />
            </div>
            <div style={{ width: '90%', height: '48px', marginTop: '9px' }}>Fullscreen Overlay</div>

            <div style={{ width: '10%', float: 'left', marginTop: '12px' }}>
                <Checkbox color="default" />
            </div>
            <div style={{ width: '90%', height: '48px', marginTop: '9px' }}>Custom Art</div>

            <div style={{ width: '10%', float: 'left', marginTop: '12px' }}>
                <Checkbox color="default" />
            </div>
            <div style={{ width: '90%', height: '48px', marginTop: '9px' }}>Other</div>

        </FormGroup>

        <FormGroup controlId='control-form-referral' hidden={modeFilter === 'Advertiser'}>
            <p className='control-label'>
                Referral URI (optional)
            </p>
            <FormControl type='text' />
        </FormGroup>
    </div>
)

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OptionalFormField);