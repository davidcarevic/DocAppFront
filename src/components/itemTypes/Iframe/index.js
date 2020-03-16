import React from 'react';
import Iframe from 'react-iframe'
import Form from '../../elements/Form';
import Input from '../../elements/Input';
import Button from '../../elements/Button';
import StyledLink from "../../elements/Link";
import Item from '../../Item'
import { connect } from 'react-redux';
import projectRedux from '../../../redux/projects'
import { withRouter } from 'react-router-dom';

class Embed extends Item {
  constructor(props) {
    super(props);
  }

    state = {
      type: 'embed'
    }

    render() {
      const { content } = this.state
      const project_id = this.props.match.params.id

      if (this.props.editing && this.props.first === undefined) {
            return (
                <Form onSubmit={this.handleSaveSubmit}>
                    <Input id="content" placeholder="ENTER YOUR URL" type="text" value={content} onChange={this.handleInputChange} /><br/><br/>
                    <Button type="submit">CREATE</Button><hr/>
                    <StyledLink to={"/dashboard/projects/" + project_id}>Back to Project</StyledLink>
                </Form>
            )
        }
      if (this.props.editing && !this.props.first) {
        const content = this.props.content
        return (
          <Form onSubmit={this.handleUpdateSubmit}>
              <Input id="content" type="text" value={content} onChange={this.handleInputChange} /><br/><br/>
              <Button type="submit">Save</Button>
          </Form>
        );
      }
        return (
            <Iframe url={this.props.content}/>
        )
    }
}

const mapDispatchToProps = {
  createItem: projectRedux.thunks.itemCreation,
  updateItem: projectRedux.thunks.itemUpdate

}

const mapStateToProps = state => ({
  isLoading: state.global.isLoading,
  element: state.projects.element,
  item: state.projects.item
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Embed))
