import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import LinkAddBox from './LinkAddBox'
import LinkForm from './LinkForm'
import { Box, Typography } from '@mui/material'
import LinkBox from './LinkBox'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface LinksProps {
  color: string,
  editable: boolean,
  links: Link[] | undefined,
  setSortedLinks: Dispatch<SetStateAction<Link []| undefined>>, 
}

interface Link {
  icon: string,
  text: string,
  link: string,
  _id: string,
  order: number,
}

const Links = ({color, editable, links, setSortedLinks}:LinksProps) => {
  const [open, setOpen] = useState(false)
  const [myLinks, setMyLinks] = useState(links)

  useEffect(() => {
    setOpen(false)
    const sortLinks = myLinks?.sort((a, b) => a.order - b.order)
    setMyLinks(sortLinks)
    setSortedLinks(sortLinks)
  }, [editable, myLinks])

  // Set Orden de los Elementos
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    if (myLinks) {
      const { source, destination } = result;
      const updatedLinks = Array.from(myLinks);
  
      // Extraer el enlace arrastrado y eliminarlo del array
      const draggedLink = updatedLinks.splice(source.index, 1)[0];
  
      // Insertar el enlace arrastrado en la nueva posición
      updatedLinks.splice(destination.index, 0, draggedLink);
  
      // Actualizar el valor de la propiedad 'order' en base al nuevo orden
      const reorderedLinks = updatedLinks.map((link, index) => {
        link.order = index + 1; // Sumar 1 al índice para obtener el nuevo valor de 'order'
        return link;
      });
  
      setMyLinks(reorderedLinks);
    }
  }

  return (
    <div>
        { editable && !open && (
          <div className='px-4'>
            <Box><LinkAddBox color={color} onClick={() => setOpen(true)}/></Box>
            <Typography sx={{textAlign:'center', marginTop:2, fontWeight:200, fontSize:14}}>Arrastra y ordena los enlaces como prefieras</Typography>
          </div>
        )
        }
        { editable && open &&
          <LinkForm color={color} onClick={() => setOpen(false)} setMyLinks={setMyLinks} MyLinks={myLinks}/>
        }
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='linkList'>
            {(provided) => ( 
              <Box className={`flex justify-center px-4 gap-4 flex-wrap ${editable ? 'mt-5': 'mt-0'}`}  {...provided.droppableProps} ref={provided.innerRef}>          
                { myLinks && 
                    myLinks.map((item, index) => (
                      editable ? (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <LinkBox color={color} icon={item.icon} text={item.text} link={item.link} editable={editable} id={item._id} setMyLinks={setMyLinks} MyLinks={myLinks} order={item.order}/>
                          </div>
                        )}
                      </Draggable>
                      ) : (
                        <div key={index}>
                          <LinkBox color={color} icon={item.icon} text={item.text} link={item.link} editable={editable} id={item._id} setMyLinks={setMyLinks} MyLinks={myLinks} order={item.order}/>
                        </div>
                      )
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      
    </div>
  )
}

export default Links;