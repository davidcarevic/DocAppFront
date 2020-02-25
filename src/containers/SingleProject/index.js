import React, { Component } from 'react';
import { connect } from 'react-redux'
import projectRedux from '../../redux/projects';
import { withRouter } from 'react-router-dom';
import StyledLink from "../../components/elements/Link";

class SingleProject extends Component {
    state = {
        id: ''
    }

    componentDidMount() {
        if (!this.props.isLoading) {
            this.props.getProject(this.props.match.params.id)
            this.props.getProjectSections(this.props.project.id)
        }
    }

    render() {
        let project = this.props.project
        let sections = this.props.sections
        let categories = this.props.categories //ne valja mapiranje sredi!!!
        console.log("Sections: ", sections)
        return (
            <div>
                <p>{project.name}</p>
                <p>
                {!sections ? <div>No sections</div> : sections.map((item) =>

                        <p key={item.id} id={item.id} >{item.name}</p>
                )}
                </p>
                <p>
                    <StyledLink to={"/dashboard/projects/"+this.props.match.params.id+"/invite"}>Invite a person</StyledLink>
                </p>
                <hr />
                <StyledLink to="/dashboard">Back to Dashboard</StyledLink>
            </div>
        )
      } 
      
}

const mapDispatchToProps = {
    getProject: projectRedux.thunks.retrieveProject,
    getProjectSections: projectRedux.thunks.retrieveProjectSections,
    getSectionCategories: projectRedux.thunks.retrieveSectionCategories
}

const mapStateToProps = state => ({
    project: state.projects.project,
    sections: state.projects.sections,
    categories: state.projects.categories
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleProject))