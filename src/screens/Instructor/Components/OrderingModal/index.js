import React, { useState } from 'react'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from 'pico-ui'
import { CTModal } from 'components'
import { ORD_INIT, connectWithRedux } from '../../Utils'
import './index.scss'

const OrdItem = ({ item, index, icon }) => {
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
          <span className="ip-om-item-icon"><i className="material-icons">{icon || 'video_library'}</i></span>
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

  const { type, name, items=[], icon, onSave } = ordering
  const [lisitems, setListItems] = useState(items)
  const [orderby, setOrderby] = useState('')

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
    if (orderby) setOrderby('')
  }

  const orderByName = () => {
    setListItems(_.sortBy(items, ['name']))
    setOrderby('name')
  }

  const orderByDate = () => {
    setListItems(_.sortBy(items, ['createdAt']))
    setOrderby('date')
  }

  return (
    <CTModal show middle
      onClose={handleClose} 
      onSave={handleSave}
      title={type}
    >
      {/* <h3 className="ip-om-name">{name}</h3> */}
      <div className="ip-om" data-scroll>
        <div className="w-100 ct-d-r-center-v mb-4">
          <div className="mr-2 ml-3"><b>ORDER BY</b></div>
          <Button outlined compact 
            onClick={orderByDate} 
            color={orderby === 'date' ? "teal" : ''}
          >
            DATE
          </Button>
          <Button outlined compact 
            classNames="ml-2" 
            color={orderby === 'name' ? "teal" : ''} 
            onClick={orderByName}
          >
            NAME
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={'ip-ord-'+name}>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {lisitems.map((item, index) => (
                  <OrdItem 
                    index={index} 
                    item={item} 
                    key={item.id} 
                    icon={icon}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </CTModal>
  )
}

export const OrderingModal = connectWithRedux(
  OrderingModalWithRedux,
  ['ordering'],
  ['setOrdering']
)
