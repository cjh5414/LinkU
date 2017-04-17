import * as types from '../actiontypes/Common';

export function alertSignup(){
    return {
        type: types.ALERT_SIGNUP
    };
}

export function hideSignupAlert(){
    return {
        type: types.HIDE_SIGNUP_ALERT
    };
}

export function alertConfirm(message, color) {
    return {
        type: types.ALERT_CONFIRM,
        message,
        color
    };
}

export function hideConfirmAlert() {
    return {
        type: types.HIDE_CONFIRM_ALERT
    };
}
