import React, { Component,forwardRef, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ToggleBox from '../ToggleBox';
import {getItemStyle, getItemStyleHorizontal, getListStyle, getListStyleHorizontal, getListStyleHorizontalHidden, getListStyleHorizontalDouble} from './styled';
import SingleItem from '../../components/SingleItem';
// import sortCategoryElements from './sort/index'
import CreateItem from '../CreateItem'
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import SingleElement from '../../components/SingleElement';
import { connect } from 'react-redux'
import projectRedux from '../../redux/projects';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    console.log('List : ', list)
    console.log('Start index : ', startIndex)
    console.log('End index : ', endIndex)
    let result = []
    if (list.elements) {
        result = list.elements;
    }
    if (list.items) {
        result = list.items;
    }
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    console.log('source : ', source);
    console.log('destination : ', destination);
    console.log('Droppable source : ', droppableSource);
    console.log('Droppable dest: ', droppableDestination);
    let destCheck = droppableDestination.droppableId;
    let column = 2
    if (destCheck.indexOf('e') === -1) {
        column=1
    }

    let sourceId=droppableSource.droppableId
    let destinationId=droppableDestination.droppableId


    let sourceClone = []
    let destClone = []
    if (source.elements) {
         sourceClone = source.elements;
         destClone = destination.elements;
    }
    if (source.items) {
        sourceClone = source.items;
        destClone = destination.items;
    }
    console.log("SOURCE DESTINATION U MOVE  !!!!!!!!!!!!!!!!!!!!!!!!!", sourceClone,destClone)
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    // fix for the sorting, without this the if them item from the right column is placed in the left column of
    // the same element it will be placed one position up
    if(destinationId+'e'=== sourceId){
        droppableDestination.index= droppableDestination.index - 1
    }
    destClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return ({
        result: result,
        removed: removed,
        id: droppableDestination.droppableId,
        column: column
    });
};

class DragAndDrop extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.myRef = React.createRef();
        this.handleChild = this.handleChild.bind(this)
    }
    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    componentWillReceiveProps() {
        this.setState(this.props.array);
    }

    getList = id => {
        for (let item in this.state) {
            if (parseInt(id) === parseInt(this.state[item].id)) {
                return this.state[item]
            }
        }
    };

    onDragEnd = result => {
        const { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            let list=this.getList(source.droppableId)
            const items = reorder(
                list,
                source.index,
                destination.index
            );
            let orderArray = [];
            for(let i in items){
                orderArray.push(parseInt(items[i].id))
            }
            let key = source.droppableId;
            let state = {}
            if (list.elements) {
                this.props.reorderElements(orderArray, list)
            }
            if (list.items) {
                this.props.reorderItems(orderArray, list)
            }
        }
        else {
            let sourceList= this.getList(source.droppableId)
            let destList= this.getList(destination.droppableId)
            const result = move(
                sourceList,
                destList,
                source,
                destination
            );
            /** function(projects/thunk), changes the category for an element in the current section*/
            if (sourceList.elements) {
               this.props.changeCategory(result.removed, result, this.props.section, destList);
            }
            if (sourceList.items) {
               this.props.changeElementForItem(result.removed, result, this.props.catObj,destList, result.column)
            }
            let new_state = {};
            // Object.keys(result.result).forEach(function(key) {
            //     new_state[key].elements = result[key];
            // });
            // this.setState(new_state)
        }
    };
    handleChild = (id) => {
        let selectedCategory = {}
        for (let i in this.props.hisCat) {
            for(let j in this.props.hisCat[i].elements){
                if(id === this.props.hisCat[i].elements[j].id)
                    selectedCategory = this.props.hisCat[i]
            }
        }
        if (this.props.activeCategory.id !== selectedCategory.id) {
          this.props.changeActiveCategory(selectedCategory)
        }
    }

    render() {
        if(this.props.type==="categories") {
            console.log("CATEGORIES U DND, CATEGORIES",  this.props.array)
            console.log("Internal STATE FOR DND // CATEGORIES", this.state)
            let cannotDrag=false
            if(this.props.role==='viewer'){
                cannotDrag=true
            }
            return (
                <div>
                    <DragDropContext  onDragEnd={this.onDragEnd}>
                        {Object.keys(this.state).map((list_id, index) => (
                            <ToggleBox key={index} id={this.state[index] ? this.state[index].id : ''}  category={this.props.hisCat}
                                changeActiveCategory={this.props.changeActiveCategory} title={this.state[index] ? this.state[index].name :''}>
                                <Droppable  droppableId={this.state[index]?this.state[index].id.toString():''} key={list_id} >
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                            {this.state[index].elements.map((item, index) => (
                                                <Draggable
                                                    isDragDisabled={cannotDrag}
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            id={item.id}
                                                            onDoubleClick={() => this.handleChild(item.id)}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps} style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                            <Link offset={-80} activeClass="active" className="test3" to={item.id}
                                                            spy={true} smooth={true} duration={10}>{item.title}</Link>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </div>
                                    )}
                                </Droppable>
                            </ToggleBox>
                        ))}
                    </DragDropContext>
                </div>
            );
        }
        if(this.props.type==="elements"){
            console.log("CATEGORIES U DND, ELEMENTS AND ITEMS",  this.props.array)
            console.log("Internal STATE FOR DND // ELEMENTS AND ITEMS", this.state)
            let role=this.props.role
            // let ele={
            // }
            // let arrayLeft=[]
            // let arrayRight=[]
            // let eleCount=0
            // let tmpLeft=[]
            // let tmpRight=[]
            //
            // for(let ele in this.props.array) {
            //     eleCount++
            //     for (let item in this.props.array[ele].items) {
            //         if (this.props.array[ele].items[item].column === 1) {
            //             arrayLeft.push(this.props.array[ele].items[item])
            //         } else {
            //             arrayRight.push(this.props.array[ele].items[item])
            //         }
            //     }
            //     tmpLeft[ele]=arrayLeft
            //     tmpRight[ele]=arrayRight
            //
            //     arrayLeft=[]
            //     arrayRight=[]
            // }

            let cannotDrag=false
            if(this.props.role==='viewer'){
                cannotDrag=true
            }

            return(
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        {Object.keys(this.props.array).map((list_id,index) => (
                            <div key={'i' + index}>
                                <Element name={this.props.array[index].id} key={'e' + index}>
                                  <SingleElement role={this.props.role} id={this.props.array[index].id} category={this.props.category} title={this.props.array[index].title}
                                      description={this.props.array[index].description}/>
                                </Element><br />
                                <CreateItem role={this.props.role} element={this.state[index]?this.state[index].id:''}/>
                                <Droppable droppableId={this.props.array[index]?this.props.array[index].id.toString():''} >
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} style={
                                            this.props.array[index].items.find(item=>item.column===2)?
                                                getListStyleHorizontal(snapshot.isDraggingOver):
                                                getListStyleHorizontalDouble(snapshot.isDraggingOver, Draggable.isDragging, snapshot.onBeforeDragStart)
                                        }>
                                            {this.props.array[index]?this.props.array[index].items.map((item, index) => (
                                                item.column===1?
                                                <Draggable
                                                    isDragDisabled={cannotDrag}
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps} style={getItemStyleHorizontal(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                            <SingleItem role={this.props.role} id={item.id} type={item.type}  content={item.content} first={true}/>

                                                        </div>
                                                    )}
                                                </Draggable>:''
                                            )):''}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                <Droppable droppableId={this.props.array[index]?this.props.array[index].id.toString()+'e':''} >
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} style={
                                            this.props.array[index].items.find(item=>item.column===2)?
                                                getListStyleHorizontal(snapshot.isDraggingOver):
                                                getListStyleHorizontalHidden(snapshot.isDraggingOver, Draggable.isDragging, snapshot.onBeforeDragStart)}>
                                            {this.props.array[index]?this.props.array[index].items.map((item, index) => (
                                                item.column===2?
                                                <Draggable
                                                    isDragDisabled={cannotDrag}
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps} style={getItemStyleHorizontal(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                            <SingleItem role={this.props.role} id={item.id} type={item.type} content={item.content} first={true}/>

                                                        </div>
                                                    )}
                                                </Draggable>:''
                                            )):''}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>
            );
        }
    }
}

export default DragAndDrop
