import React, { Component } from 'react';
import { connect } from 'react-redux';
import projectRedux from '../../redux/projects'
import { withRouter } from 'react-router-dom';
import Form from '../elements/Form';
import Button from '../elements/Button';
import { StyledSection, Div } from './styled';
import { DotsIcon } from '../elements/Icons'
import AutosizeInput from 'react-input-autosize';

class Section extends Component {
    constructor(props) {
        super(props)
    }

    state = {
      editing: false,
      buttonText: 'Edit',
      name: this.props.name,
      description: this.props.description
    }

    handleChange = (input, event) => {
		const newState = {};
		newState[input] = event.target.value;
		this.setState(newState);
	};

    handleInputChange = (e) => {
        this.setState({ [e.target.id]: e.target.value })
    }

    handleEditingMode = (e) => {
      e.preventDefault();
      const { role } = this.props
      if (role === 'admin' || role === 'editor') {
        if (this.state.editing) {
          this.setState({
            editing: false,
            buttonText: 'Edit',
            name: '',
            description: ''
          })
        }
        else {
          this.setState({
            editing: true,
            buttonText: 'Cancel',
            name: this.props.name,
            description: this.props.description
          })
        }
      }
    }

    handleSectionChange = (e) => {
        e.preventDefault()
        console.log("THIS PROPS SECTIOn", this.props)
        this.setState({
            selected_section: e.target.id
        })
        this.props.getSectionCategories(this.props.section.id, this.props.section)
    }

    handleUpdateSubmit = (e) => {
      e.preventDefault();
      const { name, description } = this.state
      const sectionId = this.props.id
      this.props.updateSection(sectionId, name, description, this.props.section,this.props.project.id)
        this.setState({editing:false})
    }

    handleDeleteSubmit = (e) => {
      e.preventDefault();
      const sectionId = this.props.id
      this.props.deleteSection(sectionId)
    }


    render() {
      const { editing, name } = this.state
      const { role } = this.props
      if (editing) {
        return (
          <Form onSubmit={this.handleUpdateSubmit}>
            <AutosizeInput
              placeholder="CATEGORY NAME"
              placeholderIsMinWidth
              name="form-field-name"
              value={name}
              onChange={this.handleChange.bind(this, 'name')}
              style={{ border: 'none' }}
              inputStyle={{ background: '#F0F0F0', border: 'none', padding: 5, fontSize: '1.17em', fontWeight: 'bold' }}
            /><br /><br />
            <Button type="submit"  width={'105px'}>Save</Button>
            { role === 'admin' ?
              <Button onClick={this.handleDeleteSubmit} width={'105px'}  top={'28px'}>Delete</Button> : ''
            }
            <Button onClick={this.handleEditingMode} width={'105px'}  top={'28px'}>{this.state.buttonText}</Button>
          </Form>
        )
      } else {
          return (
            <Div>
              <StyledSection key={this.props.key} id={this.props.id} onClick={this.handleSectionChange}>{this.props.name}</StyledSection>
              { (role === 'admin' || role === 'editor') ?
                <DotsIcon onClick={this.handleEditingMode}/> : ''
              }
            </Div>
          )
      }
    }
}

const mapDispatchToProps = {
    getSectionCategories: projectRedux.thunks.retrieveSectionCategories,
    setSection: projectRedux.actions.setSection,
    getCategoryElements: projectRedux.thunks.retrieveCategoryElements,
    updateSection: projectRedux.thunks.sectionUpdate,
    deleteSection: projectRedux.thunks.sectionDelete
}

const mapStateToProps = state => ({
    element: state.projects.element,
    category: state.projects.category
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Section))
