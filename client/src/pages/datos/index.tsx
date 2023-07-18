import { useEffect, useState } from 'react';
import { Box, Button, Card, InputBase, Modal, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { TbEditCircle } from 'react-icons/tb';
import { ImCheckmark, ImCross } from 'react-icons/im';
import { IoMdColorPalette } from 'react-icons/io';
import { SketchPicker } from 'react-color'
import Links from '../../components/user-panel/links/Links';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ImageUploader from '../../components/user-panel/image/ImageUploader';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/loading.json'
import { RiUserVoiceFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import vCard from 'vcf';
import { MdConnectWithoutContact } from 'react-icons/md';

interface ProfileFormData {
    _id: string;
    color: string;
    name: string;
    work: string;
    description: string;
    email: string;
    sortedlinks?: Link[];
}

interface userData {
    _id: string,
    email: string,
    profile: ProfileFormData,
    vcard: VCard,
    allLinks: Link[] | undefined,
}

interface VCard {
    visible: boolean,
    name: string,
    lastname: string, 
    position: string,
    organization: string,
    phone: string,
    workphone: string,
    email: string,
    web: string,
  }

interface Link {
    icon: string,
    text: string,
    link: string,
    order: number,
    _id: string,
}

const Datos = () => {
    const { handleSubmit, register, setValue } = useForm<ProfileFormData>();
    const [editable, setEditable] = useState(false)
    const [openColorPicker, setOpenColorPicker] = useState(false)
    const [color, setColor] = useState('#3366CC')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<userData>()
    const [sortedLinks, setSortedLinks] = useState<Link[] | undefined>();
    const [user, setUser] = useState();
    
    useEffect(() => {
        if (sortedLinks) {
          setValue('sortedlinks', sortedLinks);
        }
        setValue('color', color)
    }, [sortedLinks, color]);

    useEffect(() => {
        setLoading(true)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedData = JSON.parse(storedUser);
          setUser(parsedData.username)
          const email = parsedData.email;
          setValue('email', email);
          const fetchUserData = async () => {
              try {
                // Aquí debes realizar la llamada a tu API para obtener los datos del usuario
                const response = await axios.get(`https://mylicard.onrender.com/api/v1/usuarios/profile?email=${email}`);
                const userData = response.data; 
                setData(userData)
                if(userData.profile){
                    setValue('name', userData.profile.name);
                    setValue('work', userData.profile.work);
                    setValue('description', userData.profile.description);
                    if(userData.profile.color){
                        setColor(userData.profile.color)
                    }
                    
                }
                setLoading(false)
              } catch (error) {
                console.error(error);
              }
          };
          fetchUserData();
        }
    }, []);

    const onSubmit = async (data: ProfileFormData) => {
        setLoading(true)
        try {
        const response = await axios.patch('https://mylicard.onrender.com/api/v1/usuarios/profile', data);
            setEditable(false)
            location.reload()
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };

    if (loading) {
        return   (
            <div>
                <div className="flex flex-col items-center w-full min-h-screen">
                    <Lottie animationData={loadingAnimation} className="max-w-sm"/>
                </div>  
            </div>
        )
    }

    // VCard
    const card = new vCard();
    if (data?.vcard) {
        if (data?.vcard.email){
        card.add('email', data?.vcard.email)
        }
        if (data?.vcard.lastname && data?.vcard.name) {
        card.add('n', `${data?.vcard.lastname};${data?.vcard.name}`);
        }
        if (data?.vcard.organization) {
        card.add('org', data?.vcard.organization);
        }
        if (data?.vcard.phone){
        card.add('tel', data?.vcard.phone, { type: ['work'] });
        }
        if (data?.vcard.position) {
        card.add('title', data?.vcard.position);
        }
        if (data?.vcard.web) {
        card.add('url', data?.vcard.web);
        }
        if (data?.vcard.workphone) {
        card.add('tel', data?.vcard.workphone, { type: ['work', 'voice'] });
        }
    }
    const vcardContent = card.toString();

    const handleDownload = () => {
        const blob = new Blob([vcardContent], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contact.vcf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className='max-w-sm ml-auto mr-auto'>
            <Card className='max-w-sm min-h-[52rem] ml-auto mr-auto relative shadow-2xl' sx={{borderRadius:'1.75rem'}} component='form' onSubmit={handleSubmit(onSubmit)}>
            {/* Botones Editar, Guardar y Cancelar */}
                <Box className='w-full h-32 rounded-t-[1.75rem] rounded-bl-[1rem] rounded-br-[6rem] relative z-0' sx={{backgroundColor:color}}>
                    { !editable ?
                        <Box>
                            <Tooltip title="Ver Perfil Público" arrow >
                                <Button onClick={() => setEditable(true)} className='left-4 top-4' sx={{ borderRadius:'50%', background:'linear-gradient(45deg, #0b8793 30%, #360033 120%)', minWidth:'0px!important', width:'60px!important', height:'60px!important', py:2, "&:hover":{opacity:0.9, scale:105}}}>
                                    <TbEditCircle className='text-3xl text-white'/>
                                </Button>
                            </Tooltip>
                            <Box className='absolute right-5 z-50 top-4'>
                                <Tooltip title="Ver Perfil Público" arrow >
                                    <Button component={Link} to={`/${user}`} target="_blank" rel="noopener" sx={{ borderRadius:'50%', background:'linear-gradient(45deg, #0b8793 30%, #360033 120%)', minWidth:'0px!important', width:'60px!important', height:'60px!important', py:2, "&:hover":{opacity:0.9, scale:105}}} className='shadow-2xl'>
                                        <RiUserVoiceFill className='text-2xl text-white'/>
                                    </Button>
                                </Tooltip>
                            </Box>
                        </Box>
                        : (
                        <Box>
                            <Stack sx={{position:'absolute'}} >
                                <Box className='flex justify-between p-2 min-w-[370px]'>
                                    <Box className='flex gap-2'>
            {/* Form - Submit */}
                                        <Button className='shadow-2xl hover:text-[#fcfcfc]' sx={{backgroundColor:'#fcfcfc', borderRadius:'12px', color:'green', '&:hover': { backgroundColor: 'green' } }} type='submit' >
                                            <ImCheckmark className='text-lg m-2'/>
                                        </Button>
                                        <Button className='shadow-2xl hover:text-[#fcfcfc]' sx={{backgroundColor:'#fcfcfc', borderRadius:'12px', color:'#b0040b', '&:hover': { backgroundColor: '#b0040b' } }} onClick={() => setEditable(false)}>
                                            <ImCross className='text-lg m-2'/>
                                        </Button>
                                    </Box>
                                    <Button onClick={() => setOpenColorPicker(true)}>
                                        <IoMdColorPalette className='text-4xl bg-gradient-to-r from-orange-600 to-purple-600 text-white rounded-full p-1'/>
                                    </Button>
                                </Box>
                            </Stack>
                            <Modal open={openColorPicker} onClose={() => setOpenColorPicker(false)}>
                                <Box className='w-full flex flex-col items-center justify-center h-full'>
                                    <Box className='bg-white dark:bg-black max-w-[15.5rem] rounded-2xl p-4 flex flex-col justify-center items-center gap-3'>
                                        <SketchPicker color={color} onChange={(color) => setColor(color.hex)}/>
                                        <Box className='flex gap-2 w-full'>
                                            <Button fullWidth sx={{color:'red', border:2, borderColor:'red', borderRadius:'10px', paddingY:2}} onClick={()=>{{setOpenColorPicker(false)}; setColor(data?.profile.color || '#3366CC')}}>
                                                <ImCross />
                                            </Button>
                                            <Button fullWidth sx={{color:'green', border:2, borderColor:'green', borderRadius:'10px'}} onClick={()=>setOpenColorPicker(false)}>
                                                <ImCheckmark />
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>
                        )
                    }

                </Box>
                <Box className='w-full flex justify-center -mt-16 z-50 relative' >
            {/* Form - Imagen */}
                    <ImageUploader editable={editable} />
                </Box>
                <Box className={`flex justify-center items-center flex-col mt-2 px-4 text-center ${editable ? 'gap-2':'gap-0'}`}>
            {/* Form - Nombre y Apellido */}
                    <InputBase readOnly={editable ? false: true} placeholder="Nombre y Apellido" inputProps={{ maxLength: 32 }} sx={{'& input': { textAlign: 'center'}, fontWeight:600, fontSize:19}} className={`w-full rounded-xl ${editable ? 'border-[1px] border-[#DBDBDB]' : 'border-0'}`} {...register("name")} type='text'/>
            {/* Form - Puesto y Empresa */}
                    <InputBase readOnly={editable ? false: true} placeholder="Puesto y Empresa" inputProps={{ maxLength: 42 }} sx={{'& input': { textAlign: 'center'}, fontWeight:400, fontSize:15 }} className={`w-full rounded-xl ${editable ? 'border-[1px] border-[#DBDBDB]' : 'border-0'} `}  {...register("work")} type='text'/>
            {/* Form - Descripción Breve */}
                    <InputBase multiline readOnly={editable ? false: true} placeholder='Breve descripción tuya o de tu marca' inputProps={{maxLength: 88 }} sx={{'& textarea': { textAlign: 'center'}, fontWeight:200, fontSize:15 }} className={`w-full rounded-xl ${editable ? 'border-[1px] border-[#DBDBDB]' : 'border-0'} mt-2`}  {...register("description")} type='text'/>
            {/* Form - Correo */}
                    <TextField sx={{display:'none'}} {...register('email')} />
                </Box>
            {/* Formulario Links */}
                <Box className='py-4 mb-32'>
                    <Links color={color} editable={editable} links={data?.allLinks} setSortedLinks={setSortedLinks}/>
                </Box>
                { data?.vcard && data?.vcard.visible &&
                  <Box className='px-6 absolute bottom-7 w-full'>
                    <Button  onClick={handleDownload} fullWidth variant="contained" sx={{ borderRadius:'20px', py:3, backgroundColor:data?.profile.color, opacity:0.8, "&:hover":{opacity:1, backgroundColor: data?.profile.color}}} className='flex items-center justify-center gap-2'>
                      <MdConnectWithoutContact  className='text-3xl text-white'/>
                      <Typography sx={{fontWeight:600, fontSize:16, color:'white'}}>Guardar Contacto</Typography>
                    </Button>
                  </Box>
                }
            </Card>
        </div>
    )
}

export default Datos