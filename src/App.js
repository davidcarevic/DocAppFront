import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from 'react-redux';
import Home from './containers/Home';
import Register from './containers/Register';
import Dashboard from './containers/Dashboard';
import PrivateRoute from "./HOC/PrivateRoute";
import CreateTeam from "./containers/CreateTeam";
import TeamProjects from "./containers/TeamProjects";
import CreateProject from "./containers/CreateProject";
import InviteUser from "./containers/InviteUser";
import ForgotPassword from "./containers/ForgotPassword";
import SingleProject from "./containers/SingleProject";

const App = props => (
    <Router>
      <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register}/>
      <Route exact path="/register/:guid" component={Register}/>
      <Route exact path="/forgot-password" component={ForgotPassword}/>
      <Route exact path="/forgot-password/:guid" component={ForgotPassword}/>
      <PrivateRoute exact path="/dashboard" Component={Dashboard}/>
      <PrivateRoute exact path="/dashboard/teams/create" Component={CreateTeam}/>
      <PrivateRoute exact path="/dashboard/:id" Component={TeamProjects}/>
      <PrivateRoute exact path="/dashboard/projects/:id/invite" Component={InviteUser}/>
      <PrivateRoute exact path="/dashboard/projects/create" Component={CreateProject}/>
      <PrivateRoute exact path="/dashboard/projects/:id" Component={SingleProject}/>
      <PrivateRoute exact path="/invite" Component={InviteUser}/>
      </Switch>
    </Router>
  )

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(App);
