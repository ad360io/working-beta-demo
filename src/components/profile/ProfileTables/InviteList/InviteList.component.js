/*
Core Libs
*/
import React from 'react';

/*
React Bootstrap Components
*/
import { Button }                  from 'react-bootstrap';
import { Popover, OverlayTrigger } from 'react-bootstrap';


/**
 * InviteList Component
 * User should be able to create a new smart contract when accepting a invite
 * Invite listing should be removed from list after action is performed.
 */
const InviteList = () => (
    <div className='invite-list-container'>
        <div className='table-responsive' style={{height: '320px', margin:'2%'}}>
            <table className='table table-bordered mb-0'>
                <thead className='thead-default'>
                <tr>
                    <th>Invite Detail</th>
                    <th style={{width:'25%', textAlign:'center'}}>Action</th>
                </tr>
                </thead>
                
                    {
                       sampleTableContent()
                    }
                
                
            </table>
        </div>
    </div>
)

/**
 * Dynamically generate dummy data, 
 * can take in props in future to create all invite listings.
 */
const sampleTableContent = () => {
    
    let samples = [];
    for(let i = 0; i < 3; i++){
        
        const listingPopover = (
            <Popover title='User X sent you an invite' id={'popover'+i}>
                <strong>Info</strong> Some basic info <br/>
                <strong>Pricing</strong> Listing pricing
            </Popover>
        )

        samples.push(
            (
                <tr key={'invite-tr'+i}>
                    <td>
                        <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={listingPopover}>
                            <a style={{cursor: 'pointer'}}>Some of my listing name</a>
                        </OverlayTrigger> 
                    </td>
                    <td style={{textAlign: 'center'}}>
                        <Button bsStyle='success' style={{marginRight: '10px'}}>Accept</Button>
                        <Button bsStyle='danger'>Decline</Button>
                    </td>
                </tr>
            )
        )
    }

    return <tbody>
        {
            samples.map((sample)=>{
                return sample
            })
        }
        </tbody>
}


export default InviteList;