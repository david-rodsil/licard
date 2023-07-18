import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/loading.json'
import { Box, Button, Card, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FcContacts, FcOk } from 'react-icons/fc';
import { FiMail } from 'react-icons/fi';
import { AiOutlineGlobal, AiOutlineUser } from 'react-icons/ai';
import { MdWorkOutline } from 'react-icons/md';
import { VscOrganization } from 'react-icons/vsc';
import { BsTelephone } from 'react-icons/bs';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface VCardFormData {
    visible: boolean,
    name: string,
    lastname: string, 
    position: string,
    organization: string,
    phone: string,
    workphone: string,
    email: string,
    web: string,
    username: string,
}

const VCard = () => {
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState<boolean>(true)
    const { handleSubmit, register, setValue, formState: { errors } } = useForm<VCardFormData>();

    useEffect(() => {
        setLoading(true)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedData = JSON.parse(storedUser);
          const email = parsedData.email;
          setValue('username', parsedData.username)
          const fetchUserData = async () => {
              try {
                // Aquí debes realizar la llamada a tu API para obtener los datos del usuario
                const response = await axios.get(`https://mylicard.onrender.com/api/v1/usuarios/profile?email=${email}`);
                const userData = response.data; 
                if(userData.vcard){
                    setValue('name', userData.vcard.name);
                    setValue('lastname', userData.vcard.lastname);
                    setValue('visible', userData.vcard.visible);
                    setValue('position', userData.vcard.position);
                    setValue('organization', userData.vcard.organization);
                    setValue('phone', userData.vcard.phone);
                    setValue('workphone', userData.vcard.workphone);
                    setValue('email', userData.vcard.email);
                    setValue('web', userData.vcard.web);
                    setValue('visible', userData.vcard.visible);
                    setVisible(userData.vcard.visible);
                }
                setLoading(false)
              } catch (error) {
                console.error(error);
              }
          };
          fetchUserData();
        }
    }, []);

    useEffect(() => {
        setValue("visible", visible)
    }, [visible])
    
    const onSubmit = async (data: VCardFormData) => {
        setLoading(true)
        setValue("visible", visible)
        try {
        const response = await axios.patch('https://mylicard.onrender.com/api/v1/usuarios/vcard', data);
            setLoading(false)
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

    return (
        <div className='max-w-sm ml-auto mr-auto'>
            <Card className='max-w-sm min-h-screen ml-auto mr-auto border-2 border-gray-200 relative shadow-2xl' sx={{borderRadius:'20px'}} component='form' onSubmit={handleSubmit(onSubmit)}>
                <Box className='p-6'>

                    {/* Título */}
                    <Box className='flex items-center gap-2 mt-2 mb-4'>
                        <FcContacts className='text-7xl'/>
                        <Box>
                            <Typography sx={{fontWeight:800, fontSize:24}} >VCard</Typography>
                            <Typography sx={{fontWeight:200, fontSize:18}}>Tarjeta de Contacto</Typography>
                        </Box>
                    </Box>

                    {/* Descripción */}
                    <Box className='p-4 rounded-2xl' sx={{backgroundColor:'rgb(238, 238, 228,0.3)'}}>
                        <Typography sx={{fontWeight:300, fontSize:15, textAlign:'justify'}}>Botón para guardar contacto, llena los campos a continuación y da click en Guardar.</Typography>
                    </Box>

                    {/* Datos Formulario */}
                    <Box className='mt-2'>
                        {/* Visible */}
                        <Box className='flex items-center justify-center gap-1 mb-4'>
                            <IconButton
                                onClick={() => setVisible(!visible)}>
                                {visible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                            <Typography sx={{fontWeight:'200', fontSize:15}}>Mostrar en mi perfil público</Typography>
                        </Box>
                        {/* Nombre */}
                        <TextField
                            {...register("name")}
                            id="name" 
                            fullWidth 
                            label="Nombre"
                            placeholder='Nombre (s)'
                            inputProps={{ maxlenght: 30 }}
                            InputProps={{ startAdornment: <AiOutlineUser className="mx-2 text-lg"/>, }}
                            name="name"
                            sx={{ mt: 0, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Apellido */}
                        <TextField
                            {...register("lastname")}
                            id="lastname" 
                            fullWidth 
                            label="Apellido"
                            placeholder='Apellido (s)'
                            inputProps={{ maxlenght: 30 }}
                            InputProps={{ startAdornment: <AiOutlineUser className="mx-2 text-lg"/>, }}
                            name="lastname"
                            sx={{ mt: 3, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Email */}
                        <TextField
                            {...register("email", { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email inválido", }, })}
                            id="email" 
                            placeholder="Ingresa tu correo" 
                            fullWidth label="Correo Electrónico"
                            error={!!errors.email}
                            inputProps={{ maxlenght: 42 }}
                            helperText={ errors["email"] ? errors["email"].message : "" }
                            InputProps={{ startAdornment: <FiMail className="mx-2 text-lg"/>, }}
                            name="email"
                            sx={{ mt:3, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Position */}
                        <TextField
                            {...register("position")}
                            id="position" 
                            fullWidth 
                            label="Puesto de Trabajo"
                            placeholder='Puesto de Trabajo'
                            inputProps={{ maxlenght: 30 }}
                            InputProps={{ startAdornment: <MdWorkOutline className="mx-2 text-lg"/>, }}
                            name="position"
                            sx={{ mt: 3, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Organization */}
                        <TextField
                            {...register("organization")}
                            id="organization" 
                            fullWidth 
                            label="Empresa / Organización"
                            placeholder='Empresa u organización'
                            inputProps={{ maxlenght: 30 }}
                            InputProps={{ startAdornment: <VscOrganization className="mx-2 text-lg"/>, }}
                            name="organization"
                            sx={{ mt: 3, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Workphone */}
                        <TextField
                            {...register("workphone")}
                            id="workphone" 
                            type='number'
                            fullWidth 
                            label="Teléfono de Trabajo"
                            placeholder='*10 dígitos y/o lada internacional'
                            inputProps={{ maxlenght: 13 }}
                            InputProps={{ startAdornment: <BsTelephone className="mx-2 text-lg"/>, }}
                            name="workphone"
                            sx={{ mt: 3, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Phone */}
                        <TextField
                            {...register("phone")}
                            id="phone" 
                            type='number'
                            fullWidth 
                            label="Teléfono Personal"
                            placeholder='*10 dígitos y/o lada internacional'
                            inputProps={{ maxlenght: 13 }}
                            InputProps={{ startAdornment: <BsTelephone className="mx-2 text-lg"/>, }}
                            name="phone"
                            sx={{ mt: 3, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Web */}
                        <TextField
                            {...register("web")}
                            id="web" 
                            fullWidth 
                            label="Página Web"
                            placeholder='Ingresa aquí tu sitio web'
                            InputProps={{ startAdornment: <AiOutlineGlobal className="mx-2 text-lg"/>, }}
                            name="web"
                            sx={{ mt: 3, mb:2, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                        />
                        {/* Botón de Enviar */}
                        <Button type='submit' fullWidth className='flex gap-2' sx={{ py:2 ,backgroundColor:'green', borderRadius:'10px', "&:hover": { background: 'DarkGreen'}}}>
                            <FcOk className='text-2xl'/>
                            <Typography sx={{color:'#fcfcfc', fontWeight:600, fontSize:14}} >Guardar</Typography>
                        </Button>
                    </Box>
                </Box>
            </Card>
        </div>
    )
}

export default VCard