import React from 'react';
import { StyledIframe, StyledItem } from './styled'
import Form from '../../elements/Form';
import Input from '../../elements/Input';
import Button from '../../elements/Button';
import Item from '../../Item'
import { connect } from 'react-redux';
import projectRedux from '../../../redux/projects'

class Embed extends Item {
  constructor(props) {
    super(props);
    this.state.content = this.props.content || ''
  }

    state = {
      type: 'embed'
    }

    render() {
      const { content } = this.state
      const { editing, role } = this.props
      if (editing) {
        return (
          <div>
            <Form onSubmit={this.handleUpdateSubmit}>
              <StyledItem>
                <Input id="content" type="text" value={content} onChange={this.handleInputChange} /><br/><br/>
                <Button type="submit" width={'150px'}>Save</Button>
              </StyledItem>
            </Form>
            <Form onSubmit={this.handleDeleteSubmit}>
              <StyledItem>
              { role === 'admin' ?
                <Button type="submit" width={'150px'}>Delete</Button> : ''
              }
              </StyledItem>
            </Form>
          </div>
        );
      }
      if(!editing) {
        return <StyledIframe url={this.props.content}/>
      }
    }
}

const mapDispatchToProps = {
  updateItem: projectRedux.thunks.itemUpdate,
  deleteItem: projectRedux.thunks.itemDelete
}

const mapStateToProps = state => ({
  isLoading: state.global.isLoading,
  element: state.projects.element,
  item: state.projects.item,
  category: state.projects.category
})

export default connect(mapStateToProps, mapDispatchToProps)(Embed)
