import React, { useState } from 'react'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { CTModal } from 'components'
import { ORD_INIT, connectWithRedux } from '../../Utils'
import './index.scss'

const OrdItem = ({ item, index }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={"ip-om-item" + (snapshot.isDragging ? ' dragging' : '')}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span className="ip-om-item-drag-icon"><i className="material-icons">drag_handle</i></span>
          <span className="ip-om-item-icon"><i className="material-icons">video_library</i></span>
          <span className="ip-om-item-name">{item.name}</span>
        </div>
      )}
    </Draggable>
  )
}

function OrderingModalWithRedux({
  ordering=ORD_INIT,
  setOrdering
}) {

  const { type, name, items=[], onSave } = ordering
  const [lisitems, setListItems] = useState(items)

  const handleClose = () => setOrdering(ORD_INIT)
  const handleSave = () => {
    let result = _.map(lisitems, (item, index) => ({ ...item, index }))
    if (onSave) onSave(result)
    handleClose()
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = [...list]
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    
    return result
  }

  const onDragEnd = result => {
    if (!result.destination) { return }
    if (result.destination.index === result.source.index) { return }

    const lisitems_ = reorder(
      lisitems,
      result.source.index,
      result.destination.index
    )

    setListItems(lisitems_)
  }

  return (
    <CTModal show middle
      onClose={handleClose} 
      onSave={handleSave}
      title={type}
    >
      <h3 className="ip-om-name">{name}</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'ip-ord-'+name}>
          {provided => (
            <div className="ip-om" data-scroll ref={provided.innerRef} {...provided.droppableProps}>
              {lisitems.map((item, index) => (
                <OrdItem index={index} item={item} key={item.id} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </CTModal>
  )
}

export const OrderingModal = connectWithRedux(
  OrderingModalWithRedux,
  ['ordering'],
  ['setOrdering']
)
