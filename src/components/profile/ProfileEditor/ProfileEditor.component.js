/*
Core Libs
*/
import React, { Component } from 'react';
import { connect }          from 'react-redux';


/*
React Bootstrap
*/
import { Modal, Button }          from 'react-bootstrap';
import { FormGroup, FormControl } from 'react-bootstrap';
import { Alert }                  from 'react-bootstrap';

/*
Local CSS
*/
import './ProfileEditor.component.css';


/**
 * Profile Editor Component
 */
class ProfileEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nickname: this.props.nickname,
            email: this.props.email,
            avatar_url: this.props.avatar_url,
            show: false
        }

        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleConfirmEdit = this.handleConfirmEdit.bind(this);
        this.handleNicknameChange = this.handleNicknameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleAvatarUrlChange = this.handleAvatarUrlChange.bind(this);
    }

    handleShowModal(){
        this.setState({ 
            nickname: this.props.nickname,
            email: this.props.email,
            avatar_url: this.props.avatar_url,
            show: true 
        });
    }

    handleHideModal(){
        this.setState({ ...this.state, show: false });
    }

    handleConfirmEdit() {
        const { updateUserMetadata } = this.props.auth;
        let newMetadata = {
            nickname  : this.state.nickname,
            email     : this.state.email,
            picture   : this.state.avatar_url
        }
        updateUserMetadata(newMetadata);
        this.handleHideModal();
    }

    handleNicknameChange(e){
        this.setState({ ...this.state, nickname: e.target.value});
    }

    handleEmailChange(e) {
        this.setState({ ...this.state, email: e.target.value});
    }

    handleAvatarUrlChange(e) {
        this.setState({ ...this.state, avatar_url: e.target.value});
    }

    render() {
        return <div>
            <i className="fas fa-pen-square" onClick={this.handleShowModal}></i>
            <Modal show={this.state.show} onHide={this.handleHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <FormGroup controlId='control-form-title'>
                        <h4>Preferred Nickname</h4>
                        <FormControl type='text' 
                            defaultValue={this.state.nickname}
                            onChange={this.handleNicknameChange}
                        />
                    </FormGroup>

                    <FormGroup controlId='control-form-title'>
                        <h4>Preferred Email</h4>
                        <FormControl type='text' 
                            defaultValue={this.state.email} 
                            onChange={this.handleEmailChange}
                        />
                    </FormGroup>

                    <FormGroup controlId='control-form-title'>
                        <h4>Preferred Avatar URL</h4>
                        <FormControl type='text' 
                            defaultValue={this.state.avatar_url}
                            onChange={this.handleAvatarUrlChange}
                        />
                    </FormGroup>
                   
                </Modal.Body>
                
                    <Alert bsStyle="danger">
                        <h4>Caution!</h4>
                        <p style={{marginBottom:"10px"}}>
                            Any changes to the profile requires a re-login to take effects
                        </p>
                        
                        <Button bsStyle="danger" onClick={this.handleConfirmEdit}>Proceed</Button>
                        <Button style={{marginLeft: '10px'}} onClick={this.handleHideModal}>Cancel</Button>
                    </Alert>
                    
                
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        nickname   : state.ProfileReducer.profile.nickname,
        email      : state.ProfileReducer.profile.email,
        avatar_url : state.ProfileReducer.profile.avatar_url
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileEditor);

