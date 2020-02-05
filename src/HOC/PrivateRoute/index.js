import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux'
//import {logout} from '../../services'
// Higher Order Component || HOC
const PrivateRoute = props => {
    const { Component } = props;
    if(props.isLoading) {
        return <div>Loading...</div>
    }
    if(!props.isAuthenticated && !props.isLoading) {
        console.log("OVDE");
        return (
        <Redirect to="/" />
        )
    }
    return (
    <Route exact={props.exact} path={props.path} render={(routerprops) =>{
        const handleFormSubmit = (e) => {
            e.preventDefault();
            console.log('DDDDDDD')
            console.log(routerprops)
            window.localStorage.removeItem('refreshToken');
            routerprops.history.push('/')
        }
       return(    
        <div>
            <form  onSubmit={handleFormSubmit}>
                <input type="submit" value="Logout" className='le-btn'/>    
            </form>
            <Component {...props} />
        </div>
        )
    }
    }
    />
    )
}

const mapStateToProps = state => {
    return {
        user:state.user,
        isLoading: state.global.isLoading,
        isAuthenticated: state.user.isAuthenticated,
        authenticationError: state.user.authenticationError,
        authenticationErrorMessage: state.user.authenticationErrorMessage,
    }
}

        

export default connect(mapStateToProps,null)(PrivateRoute);