import * as types from './types';

export const isAuthenticating = (isAuthenticating) => ({
    type: types.IS_AUTHENTICATING,
    payload: isAuthenticating
})

export const setAccessToken = token => {
    return {
        type: types.SET_ACCESS_TOKEN,
        payload: token
    }
}

export const setRefreshToken = token => {
    return {
        type: types.SET_REFRESH_TOKEN,
        payload: token
    }
}

export const authenticateUser = isAuthenticated => {
    return {
        type: types.AUTHENTICATE,
        payload: isAuthenticated
    }
}

export const authenticationError = hasError => {
    return {
        type: types.AUTHENTICATION_ERROR,
        payload: hasError
    }
}

export const authenticationErrorMessage = errorMessage => {
    return {
        type: types.AUTHENTICATION_ERROR_MESSAGE,
        payload: errorMessage
    }
}