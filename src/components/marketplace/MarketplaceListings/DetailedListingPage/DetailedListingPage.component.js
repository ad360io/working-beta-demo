/*
Core Libs
*/
import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { withRouter }       from 'react-router-dom';

/*
Networking 
*/
import axios from 'axios';

/*
Local CSS
*/
import './DetailedListingPage.component.css';

/*
Placeholder Images
*/
import branded_content_ph      from '../../../../assets/images/branded_content_placeholder.png';
import influencer_marketing_ph from '../../../../assets/images/influencer_marketing_placeholder.png';
import sponsorships_ph         from '../../../../assets/images/sponsorships_placeholder.png';
import default_ph              from '../../../../assets/images/pug_face.jpg';

import { Card, CardText, CardTitle }  from 'material-ui';
import Divider                        from 'material-ui/Divider';
import Button                         from '@material-ui/core/Button';

import DetailedImageSlider from './DetailedImageSlider/DetailedImageSlider.component';


class DetailedListingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            error: null,
            listing: null,
            width: window.innerWidth
        }

        // Binding functions
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.decideImage = this.decideImage.bind(this);
        this.handleCloseListing = this.handleCloseListing.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ ...this.state, width: window.innerWidth });
    }

    decideImage(url, marketingType) {
        if(marketingType === 'Branded Content'){
            return branded_content_ph;
        }else if(marketingType === 'Influencer Post'){
            return influencer_marketing_ph;
        }else if(marketingType === 'Sponsorship'){
            return sponsorships_ph;
        }else{
            return default_ph;
        }
    }
    
    componentWillMount() {
        // call on start load to get data
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/listing?id=eq.${this.props.match.params.id}`;
        axios.get(listingURL)
            .then((response) => {
                document.title = `${response.data[0].name} - Qchain`;
                this.setState({
                    ...this.state,
                    fetched: true,
                    listing: response.data[0]
                })
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    fetched: true,
                    error: err
                })                
        })
    }

    handleCloseListing() {
        this.props.closeListing();
        document.title = 'Qchain - Marketplace';
    }

    render() {
        // console.log(this.props.match.params.id)
        // make a request to get detailed listing info using ID
        // parse info onto the page
        return <div className='detailed-listing-container'>
            {
                (this.state.fetched
                    ? ( this.state.listing.classtype === "request" 
                        ? <DetailedRequestListing 
                                listing={this.state.listing}
                                decideImage={this.decideImage}
                          />
                        : <DetailedContentSpaceListing 
                                listing={this.state.listing} 
                                decideImage={this.decideImage}
                          />
                      )
                    : null
                )
            }
        </div>
    }
}

const DetailedRequestListing = ({ listing, decideImage }) => (
    

    <div className='detailed-listing-renderer'>
        {
            /* ********************  SCHEMA OF A REQUEST LISTING ********************
                "id" : #,
                "type" : "",
                "requestor": "",
                "currency": "",
                "marketingType": "",
                "medium": "",
                "contentTopic": "",
                "images": "",
                "ask_date_from": "",
                "requestDescription": "" 
            */
        }
        <div className='detailed-image-container'>
            <Card>
                <CardText>
                    <DetailedImageSlider imageSrc={decideImage(listing.images, listing.ad_format)} />
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Save this listing</a>
                <Divider />
                <a className='detailed-listing-action'>Add to watch list</a>
                <Divider />
                <a className='detailed-listing-action'>Some other simple actions</a>
                <Divider />
            </div>
        </div>
        
        <Card className='listing-concrete-details-container'>
            <CardTitle>
            <h1>{listing.name}</h1>
            </CardTitle>
            <Divider />
            <CardText>
            <div>Marketing Type: {listing.ad_format} {listing.classtype}</div>
            <div>Marketing Medium: {listing.medium}</div>
            <br />
            <div>{listing.description}</div>
            </CardText>
        </Card>
        
        <div className='poster-info-container'>
            <Card>
                <CardTitle>
                    <h3>Requestor Info:</h3>
                    <h4>{listing.advertiser} trading in {listing.currency}</h4>
                </CardTitle>
                <CardText>
                <div>Ask Date: {listing.date_added}</div>
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Add requestor to favorite</a>
                <Divider />
                <a className='detailed-listing-action'>Contact this requestor</a>
                <Divider />
            </div>
        </div>
    </div>
)

const DetailedContentSpaceListing = ({ listing, decideImage }) => (
    <div className='detailed-listing-renderer'>
        {
            /* ********************  SCHEMA OF A CONTENT SPACE LISTING ********************
                "id" : #,
                "type" : "",
                "creator": "",
                "ask_date_from": "",
                "ask_date_to": "",
                "marketingType": "",
                "medium": "",
                "contentTopic": "",
                "pricing": #,
                "timeUnit": "",
                "currency": "",
                "listingDescription": "",
                "referralURI": ""
            */
        }
        <div className='detailed-image-container'>
            <Card>
                <CardText>
                    <DetailedImageSlider imageSrc={decideImage(listing.images, listing.ad_format)} />
                    
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Save this listing</a>
                <Divider />
                <a className='detailed-listing-action'>Add to watch list</a>
                <Divider />
                <a className='detailed-listing-action'>Some other simple actions</a>
                <Divider />
            </div>
        </div>
        
        <Card className='listing-concrete-details-container'>
            <CardTitle>
            <h1>{listing.name}</h1>
            </CardTitle>
            <Divider />
            <CardText className='listing-details-text'>
            <div className='details-text'>
                <p>
                    Marketing Type: {listing.ad_format} {listing.classtype} 
                </p>
                <p>
                    Marketing Medium: {listing.medium}
                </p>
                
            </div>
            
            <br />
            <div className='buy-section'>
                <div className='price-section'>Price: {listing.price} {listing.currency}</div>
                <Button className='buy-button' variant='outlined' color='primary'>Buy It Now</Button>
            </div>
            <br />
            <div className='details-text'>{listing.description}</div>
            </CardText>
        </Card>
        
        <div className='poster-info-container'>
            <Card>
                <CardTitle>
                    <h3>Creator Info:</h3>
                    <h4>{listing.publisher} trading in {listing.currency}</h4>
                </CardTitle>
                <CardText>
                
                <div>Promotion Duration: <br/> {listing.date_added} - {listing.expiration_date}</div>
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Add publisher to favorite</a>
                <Divider />
                <a className='detailed-listing-action'>Contact this publisher</a>
                <Divider />
            </div>
        </div>

        
    </div>
)

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailedListingPage));