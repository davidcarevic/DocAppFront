import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ToggleBox from '../ToggleBox';
import { getItemStyle, getListStyle } from './styled';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {

    console.log('List : ',list)
    console.log('Start index : ',startIndex)
    console.log('End index : ',endIndex)
    const result = Array.from(list);
    console.log("RESULT MOVE /////////////// ",result)
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    console.log('source : ',source)
    console.log('destination : ',source)
    console.log('Droppable source : ',droppableSource)
    console.log('Droppable dest: ',droppableDestination)
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    // const removed is the moved item
    // droppableDestination.droppableId is the ID for the category that will be used for the element as foreign key
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return ({
        result: result,
        removed: removed,
        id: droppableDestination.droppableId
    });
};

class DragAndDrop extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    order=["2", "1", "3"]
    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    componentWillReceiveProps() {
        var new_state = []
        console.log("PROPOVI pre petlje,", this.props.props)

        var order=[]

        /** gets the order of the category elements and creates a similar object to the state*/
        for(let i = 0 ; i <  this.props.props.length;i++){
           order[this.props.props[i].id]= this.props.props[i].order
        }
        console.log("ORDER niz :", order)

       /** sets the state for drag and drop*/
        for (let i = 0; i < this.props.props.length; i++) {
            new_state[this.props.props[i].id] = this.props.props[i][this.props.props[i].id]
        }
        console.log("NEW STATE: ",new_state)


        /** remapping of the new state to fit the order*/
        for (let category = 1; category < new_state.length; category++){
            //console.log("RM CAT",new_state[category])
            //console.log("ORRDER CAT",order[category])
            new_state[category].forEach((ele,index)=>{
               // console.log("RM ELE ",ele)
                //console.log("TESTEEASRASDASD", order[category][index])
                //porediti? prepisati?
                //ele.id=order[category][index]
                console.log("ELE ID", ele)
                for(var i = 0 ; i < order[category].length;i++) {
                    if (ele.id === order[category][i]) {
                        order[category][i]=ele
                    }
                }
            })
            console.log(order[category],category)
        }

        console.log("NEW STATE POSLE PROMENA IDIJEVA", new_state)
        console.log("ORDER POSLE" , order)

        /** converts the id of the element into string*/
        for (let p in new_state) {
            for (let i = 0; i < new_state[p].length; i++) {
                new_state[p][i].id = new_state[p][i].id.toString()
            }
        }

        this.setState(new_state)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("PREV PROPS,",prevProps)
        // console.log("prevState ORDER KOJI MI TREBA??????????????????????????",prevState)
         console.log(" STATE ", this.state)
        if(prevState!==this.state){
            // console.log("SWAP BACK ORDER")
        }
        // console.log("snapshot ",snapshot)
    }

    getList = id => this.state[id];

    onDragEnd = result => {
        const { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );
            let key = source.droppableId;
            let state = { [key]: items };
            this.setState(state);
        }
        else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            /** function(projects/thunk), changes the category for an element */
            this.props.changeCategory(result.removed, result.id, this.props.section.id)
            let new_state = {};
            Object.keys(result.result).forEach(function(key) {
                new_state[key] = result[key];
            });
            this.setState(new_state);
        }
    };

    render() {
        return (
            <div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {Object.keys(this.state).map((list_id, index) => (
                        <ToggleBox key={index} title={this.props.props[index]?this.props.props[index].name:''}>
                        <Droppable droppableId={list_id} key={list_id}>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state[list_id].map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps} style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    {item.title}
                                                </div>
                                            )}
                                        </Draggable>
                                     ))}
                                    {provided.placeholder}
                                </div>
                             )}
                        </Droppable>
                        </ToggleBox>
                    ))}
                </DragDropContext>
            </div>
        );
    }
}


export default DragAndDrop;