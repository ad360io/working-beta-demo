/*
Core Libs
*/
import React, { Component } from 'react';
import axios                from 'axios';

/**
 * ActiveListing Component
 */
class ActiveListing extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            finished: false,
            err: null,
            activeListing: []
        }
        this.loadData();
        this.loadData = this.loadData.bind(this);
    }

    componentWillReceiveProps() {
        this.loadData();
    }

    loadData() {
        const activeListingURL = "https://qchain-marketplace-postgrest.herokuapp.com/my_active_contentspace_listing";
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        axios.get(activeListingURL, config)
                    .then((response) => {
                        this.setState({
                            ...this.state,
                            finished: true,
                            activeListing: response.data
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({
                            ...this.state,
                            finished: true,
                            err: err
                        })
                    })
    }

    render() { 
        return <div className='active-listing-container'>
            <div className='table-responsive' style={{height: '320px', margin:'2%'}}>
                {
                    (this.state.finished && this.state.err === null && this.state.activeListing.length === 0)
                        ? (<p style={{textAlign: 'center'}}>There is currently no active listing...</p>)
                        : null
                }

                {
                    (this.state.finished && this.state.err === null && this.state.activeListing.length > 0)
                        ? (<table className='table table-bordered mb-0'>
                                <thead className='thead-default'>
                                <tr>
                                    <th>Content Space Title</th>
                                    <th>Ad Format</th>
                                    <th>Medium</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.activeListing.map((listing, i)=>{
                                            return (<tr key={'listingtr' + i}>
                                                <td>{listing.name}</td>
                                                <td>{listing.ad_format}</td>
                                                <td>{listing.medium}</td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                                
                            </table>
                            )
                        : null
                }
            </div>
        </div>
    }
}


export default ActiveListing;