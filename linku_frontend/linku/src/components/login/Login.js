import React, { Component } from 'react';
import { Header, Button, Container } from 'semantic-ui-react'
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import Signup from '../signup/Signup';

import { loginRequest } from '../../actions/Login';
import { hideLoginAlert } from '../../actions/Common';
import { buttonStyle } from '../utils/style/Button';

import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import ConfirmModal from '../utils/ConfirmModal';

class Login extends Component {
    state = { modalOpen: false }

    handleOpen = (e) => this.setState({
        modalOpen: true,
    })

    handleClose = (e) => this.setState({
        modalOpen: false,
    })

    _handleLoginSubmit = (values) => {
        this.props.loginRequest(values.username, values.password);
    }
    render() {
        return (
            <Container text>
                { this.props.loggedIn && <Redirect to="/"/> }
                <ConfirmModal />
                <Header style={{marginTop: '30px'}}>링쿠 로그인</Header>
                <p>
                    <h>링쿠는 대학생만 이용할 수 있는 서비스입니다.</h>
                    <LoginForm onSubmit = {this._handleLoginSubmit}/>
                    <Button style={buttonStyle} onClick={() => {this.props.history.push('/signup')}} content="회원가입" fluid />
                </p>
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        loggedIn : state.login.loggedIn,
        payload : state.login.payload
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest : (username, password) => {
            return dispatch(loginRequest(username, password));
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
