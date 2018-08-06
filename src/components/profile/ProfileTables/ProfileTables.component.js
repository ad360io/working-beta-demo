/*
Core Libs
*/
import React, { Component } from 'react';

/*
Local CSS
*/
import './ProfileTables.component.css';

/*
Children Components
*/
import ActiveListing  from './ActiveListing/ActiveListing.component';
import ActiveRequest  from './ActiveRequest/ActiveRequest.component';
import ActiveContract from './ActiveContract/ActiveContract.component';
import OfferList      from './OfferList/OfferList.component';

/*
React Bootstrap
*/
import { Tabs, Tab }  from 'react-bootstrap';


class ProfileTables extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeTabKey: 0
        }

        this.getListingType = this.getListingType.bind(this);
        this.handleTabOnSelect = this.handleTabOnSelect.bind(this);
    }

    getListingType() {
        return this.props.modeFilter === 'Advertiser' ? 'Ad' : 'Adspace';
    }

    handleTabOnSelect(key) {
        this.setState({activeTabKey: key})
    }

    render(){
        return <div className='dashboard-tables-container'>    
            <h2 className='dashboard-tables-title'>Participating Activities</h2>
                <Tabs activeKey={this.state.activeTabKey}
                    onSelect={this.handleTabOnSelect}
                    id='dashboard-tables-tabs'
                    style={{paddingLeft: '10%', paddingRight:'10%'}}
                    className='table-tabs'
                >

                <Tab eventKey={0} title='Offers'>
                    <OfferList activeTabKey={this.state.activeTabKey}/>
                </Tab>
                <Tab eventKey={1} title='Active Listing'>
                    <ActiveListing activeTabKey={this.state.activeTabKey} />
                </Tab>
                <Tab eventKey={2} title='Active Request'>
                    <ActiveRequest activeTabKey={this.state.activeTabKey} />
                </Tab>
                <Tab eventKey={3} title='Active Contracts'>
                    <ActiveContract activeTabKey={this.state.activeTabKey} />
                </Tab>

                
            </Tabs>  
        </div>
    }
}


export default ProfileTables;