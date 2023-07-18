import { TextField, useTheme } from '@mui/material'
import { Box, Button, Typography } from "@mui/material"
import { hexToRgb } from "@mui/material"
import { AiFillCloseCircle } from 'react-icons/ai'
import { IoMdContact } from 'react-icons/io'
import { FaUsers } from 'react-icons/fa'
import { FcLink, FcPlus } from 'react-icons/fc'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { LinkContactos, LinkRedes } from '../../../constants'
import { IconType } from 'react-icons'
import Lottie from 'lottie-react';
import loadingAnimation from '../../../assets/loading.json'
import axios from 'axios'
import { useForm } from 'react-hook-form'

interface LinkFormProps {
    color: string
    onClick: () => void;
    setMyLinks: Dispatch<SetStateAction<Link[] | undefined>>,
    MyLinks: Link [] | undefined,
}

interface Link {
    icon: string,
    order: number,
    text: string,
    link: string,
    _id: string,
}

interface LinkForm {
    email: string,
}

interface LinkProps {
    id: string;
    type: string;
    icon: IconType | null;
    iconString: string,
    link: string;
    label: string;
    placeholder: string;
}

const LinkForm = ({color, onClick, setMyLinks, MyLinks}:LinkFormProps) => {
    const rgbColor = hexToRgb(color); 
    const rgbaColor = `${rgbColor.slice(0, -1)}, 0.1)`;
    const theme = useTheme();
    const textColor = theme.palette.mode === 'dark' ? 'white' : 'black';
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedLink, setSelectedLink] = useState('');
    const [link, setLink] = useState('');
    const [selectedButton, setSelectedButton] = useState<LinkProps>({
        id: '',
        type: '',
        icon: null,
        iconString: 'string',
        link: '',
        label: '',
        placeholder: '',
    });

    const { setValue } = useForm<LinkForm>();

    const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedButton({
            ...selectedButton, 
            label: e.target.value,
        });
    };

    const handleLink = (e: ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    }

    
    const handleSubmit = async () => { 
        setLink(selectedButton?.link + link);
        setLoading(true)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedData = JSON.parse(storedUser);
            const email = parsedData.email;
            try {
                const formData = {
                    email: email,
                    icon: selectedButton?.iconString,
                    text: selectedButton?.label,
                    link: selectedButton?.link + link,
                }
                const response = await axios.post('https://mylicard.onrender.com/api/v1/links', formData);
                setLoading(false)
                if(storedUser) {
                    const parsedData = JSON.parse(storedUser);
                    const email = parsedData.email;
                    setValue('email', email);
                    if (response.status === 200) {
                        // Hacer una solicitud GET para obtener la lista actualizada de enlaces
                        try {
                          const updatedLinksResponse = await axios.get(`https://mylicard.onrender.com/api/v1/usuarios/profile?email=${email}`);
                          if (updatedLinksResponse.status === 200) {
                            const updatedLinksData = updatedLinksResponse.data;
                            setMyLinks(updatedLinksData.allLinks);
                          }
                        } catch (error) {
                          // Manejar error al obtener la lista actualizada de enlaces
                        }
                    }
                }
                onClick();
            } catch (error) {
                setLoading(false)
            }
        }
    }

    if (loading) {
        return   (
          <div>
            <div className="flex flex-col items-center w-full min-h-screen">
              <Lottie animationData={loadingAnimation} className="max-w-sm"/>
            </div>  
          </div>
        )
    }

    return (
        <Box sx={{backgroundColor:rgbaColor}} className='rounded-[2rem] p-4 relative shadow-lg'>
            <Button onClick={onClick} sx={{position:'absolute', top:10, right:0}}><AiFillCloseCircle className="text-2xl hover:text-xl duration-300"/></Button>
            <Box className='flex gap-2 items-center my-2 px-2'>
                <FcLink className='text-2xl'/>
                <Typography sx={{textAlign:'left', fontWeight:600, fontSize:15}}>Agregar enlace de</Typography>
            </Box>
            {/* Botón Redes o Contacto */}
            <Box className='flex gap-2 my-2'>
                <Button fullWidth sx={{border:2, borderRadius:'10px', borderColor:color, color:selected === 'contacto' ? '#fcfcfc': color, backgroundColor: selected === 'contacto' ? color : ''}} className="shadow-2xl flex gap-2 items-center" onClick={() => {setSelected('contacto'); setSelectedLink(''); setLink('')}}>
                    <IoMdContact className='text-2xl'/>
                    <Typography sx={{color:selected === 'contacto' ? '#fcfcfc': textColor, fontWeight:600, fontSize:13}}>Contacto</Typography>
                </Button>            
                <Button fullWidth sx={{border:2, borderRadius:'10px', borderColor:color, color:selected === 'redes' ? '#fcfcfc': color, backgroundColor: selected === 'redes' ? color : ''}} className="shadow-2xl flex gap-2 items-center" onClick={() => {setSelected('redes'); setSelectedLink(''); setLink('')}}>
                    <FaUsers className='text-2xl'/>
                    <Typography sx={{color:selected === 'redes' ? '#fcfcfc': textColor, fontWeight:600, fontSize:13}}>Redes Sociales</Typography>
                </Button>
            </Box>
            {/* Botón de Tipo de Enlace */}
            <Box className='my-2 flex'>
                <Box className='flex gap-2 justify-between w-full'>
                    { selected === 'contacto' ?
                        LinkContactos.map((item, index) => (
                                <Box className='flex flex-col gap-1 items-center' key={index}>
                                    <Button sx={{border:2, borderRadius:'10px', borderColor:color, minWidth:'30px !important', padding:'14px', color:selectedLink === item.id ? 'white' : color, backgroundColor: selectedLink === item.id ? color : ''}} onClick={() => {setSelectedLink(item.id); setSelectedButton(item); setLink('')}}>
                                        <item.icon className='text-lg'/>
                                    </Button>
                                    <Typography fontSize={10} fontWeight={400}>{item.label}</Typography>
                                </Box>
                        )) : selected === 'redes' && 
                        LinkRedes.map((item, index) => (
                            <Box className='flex flex-col gap-1 items-center' key={index}>
                                <Button sx={{border:2, borderRadius:'10px', borderColor:color, minWidth:'30px !important', padding:'14px', color:selectedLink === item.id ? 'white' : color, backgroundColor: selectedLink === item.id ? color : ''}} onClick={() => {setSelectedLink(item.id); setSelectedButton(item)}}>
                                    <item.icon className='text-lg'/>
                                </Button>
                                <Typography fontSize={10} fontWeight={400}>{item.label}</Typography>
                            </Box> 
                        ))
                    }
                </Box>
            </Box>
            {/* Formulario*/}
            { selectedLink !== '' && (
                <Box>
                    <Box className='flex flex-col gap-3 my-4'>
                        <TextField sx={{'& label':{fontSize:'13px'},'& input': { textAlign: 'left', fontSize:'13px', paddingY:'15px'} }} label="Texto personalizado" placeholder='Escribe aquí el título' value={selectedButton?.label} onChange={handleChangeLabel} />
                        <TextField sx={{'& label':{fontSize:'13px'},'& input': { textAlign: 'left', fontSize:'13px', paddingY:'15px'} }} label={selectedButton?.placeholder} placeholder='Escribe aquí el título' value={link} onChange={handleLink}/>
                    </Box>
                    <Button fullWidth className='flex gap-2' sx={{backgroundColor:'green', borderRadius:'10px', "&:hover": { background: 'DarkGreen'}}} onClick={handleSubmit}>
                        <FcPlus className='text-2xl'/>
                        <Typography sx={{color:'#fcfcfc', fontWeight:600, fontSize:13}} >Agregar</Typography>
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default LinkForm