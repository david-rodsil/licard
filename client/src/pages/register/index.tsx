import React, { useEffect, useState } from 'react';
import { layoutStyles } from "./styles";
import { Button, TextField, Box, Typography, Container, CardContent, Link as MuiLink, InputAdornment, IconButton, ThemeProvider, createTheme } from "@mui/material";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { authProvider } from '../../authProvider';
import logo from "../../assets/logo.png";
import loadingAnimation from "../../assets/loading.json";
import Lottie from 'lottie-react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginPhoto from '../../assets/loginadmin.png'
import { AiOutlineUser } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { format } from 'date-fns';
import { FiMail } from 'react-icons/fi'

interface FormData {
    email: string;
    password: string;
    username: string;
    createdAt: string;
}

interface BackendError {
    email: {
        message: string ;
    }
}

interface UserError {
    username: {
        message: string ;
    }
}

export const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [error, setError] = useState(false);
    const [backendErrors, setBackendErrors] = useState<BackendError | null>(null);
    const [errorUsername, setErrorUsername] = useState(false);
    const [userErrors, setUserErrors] = useState<UserError | null>(null);
    
    const dateFormat = 'dd/MM/yyyy';
    const today = format( new Date(), dateFormat );

    const theme = createTheme({
        palette:{
            mode: 'light'
        }
    })
  

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    
    const onSubmit = async (formData: FormData) => {
        try {
            setLoading(true);
            const response = await axios.post("https://mylicard.onrender.com/api/v1/usuarios/register", formData);
            const responseData = response.data;

            // Accede a los datos de respuesta del backend
            if (responseData.success) {
            console.log(responseData.message);
            console.log(responseData.user);
        
            const loginResponse = await authProvider.login({
                access: formData.email,
                password: formData.password,
            });
        
            if (loginResponse.success) {
                // console.log("Inicio de sesión exitoso");
                window.location.href = "/datos";
            } else {
                // El inicio de sesión falló
                console.log("Error en el inicio de sesión");
            }

            } else {
            
                // El backend devolvió un error
            console.log(responseData.message);
            }
            } catch (error: any) {
            setLoading(false)
            if (error.response && error.response.status === 409) {
                if (error.response.data.message === 'username') {
                    setErrorUsername(true)
                    setUserErrors({ username: { message: "El nombre de usuario ya está registrado"}})
                } else if (error.response.data.message === 'email') {
                    setError(true)
                    setBackendErrors({ email: { message: "El correo ya está registrado",},});
                }
            }
            console.log(error)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
          setError(false);
          setBackendErrors(null);
        }, 5000); // establece el tiempo de espera deseado en milisegundos
      
        return () => clearTimeout(timer); // limpia el temporizador si se vuelve a escribir en el input antes de que se cumpla el tiempo de espera
    }, [backendErrors]);

    const handleInputChange = (event:any) => {
        event.target.value = event.target.value.toLowerCase();
    };

    return (
        <ThemeProvider theme={theme}>
            <div className='min-h-screen flex items-center lg:justify-between lg:px-20 justify-center flex-wrap lg:flex-nowrap lg:bg-gradient-to-l bg-gradient-to-t from-white to-slate-300'>
                <div className="min-w-sm">
                    <h1 className='font-semibold text-3xl lg:text-4xl text-black'>Regístrate</h1>
                    <p className='text-lg pt-2 lg:text-xl text-gray-600'>Tu tarjeta Inteligente</p>
                </div>

                <div className="min-w-sm">
                    <img src={LoginPhoto} alt="login" className='md:w-[40rem] w-[15rem] lg:-ml-32 lg:mt-0 -mt-44' />
                </div>

                <div className="max-w-sm -mt-60 lg:mt-0">
                    <Box style={layoutStyles} className='flex items-center w-full justify-center' component="form" onSubmit={handleSubmit(onSubmit)} >
                    <Container
                        component="main"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <CardContent sx={{ "&:last-child": { pb: "32px" } }}>
                            <a href="https://licard.app" target='_blank' rel='nonreferrer' className="flex justify-center mb-5"><img src={logo} alt="licard-imagotipo"  height='10px' width="150px" style={{paddingTop: "20px"}}/></a>
                            {loading ? 
                                <div className="w-full flex items-center justify-center">
                                    <Lottie animationData={loadingAnimation}/>
                                </div>  
                            :
                                <div>
            {/* Date ----------------------------------*/} 
                                    <TextField {...register("createdAt", {required: true,})} value={today} sx={{display:'none'}}/>
            {/* Username ----------------------------------*/} 
                                    <TextField
                                    {...register("username", {
                                        required: true,
                                        pattern: {
                                            value: /^[a-zA-Z0-9_\-]+$/,
                                            message: "Nombre de Usuario inválido, no se pueden usar caracteres especiales, acentos, 'ñ', etc.",
                                        },
                                    })}
                                    id="username"
                                    margin="normal"
                                    placeholder="Ingresa tu nombre de usuario"
                                    fullWidth
                                    label="Nombre de Usuario"
                                    error={!!errors.username || errorUsername}
                                    inputProps={{ 
                                        maxLength: 30 
                                    }}
                                    InputProps={{
                                        startAdornment: <AiOutlineUser className="mx-2 text-lg"/>,
                                    }}
                                    helperText={
                                        errors["username"] 
                                        ? errors["username"].message 
                                        : userErrors?.username?.message || ""
                                    }
                                    name="username"
                                    sx={{ mt: 0, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                                    onChange={handleInputChange}
                                />                            
            {/* Email ----------------------------------*/} 
                                <TextField
                                    {...register("email", {
                                        required: true,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email inválido",
                                        },
                                    })}
                                    id="email"
                                    margin="normal"
                                    placeholder="Ingresa tu correo"
                                    fullWidth
                                    label="Correo Electrónico"
                                    error={!!errors.email || error}
                                    inputProps={{ 
                                        maxLength: 30 
                                    }}
                                    InputProps={{
                                        startAdornment: <FiMail className="mx-2 text-lg"/>,
                                    }}
                                    helperText={
                                        errors["email"] 
                                        ? errors["email"].message 
                                        : backendErrors?.email?.message || ""
                                    }
                                    name="email"
                                    sx={{ "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                                    onChange={handleInputChange}
                                />
            {/* Contraseña ----------------------------------*/} 
                                <TextField
                                    {...register("password", {
                                        required: true,
                                    })}
                                    id="password"
                                    margin="normal"
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    helperText={
                                        errors["password"] ? errors["password"].message : ""
                                    }
                                    error={!!errors.password}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="●●●●●●●●"
                                    InputProps={{
                                        startAdornment: <RiLockPasswordLine className="mx-2 text-lg"/>,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 0, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
                                />
            {/* Botón Enviar */}
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: "24px", borderRadius:'10px' }}>
                                    Registrar
                                </Button>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    sx={{
                                        mt: "24px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        fontSize="12px"
                                        color='gray'
                                    >
                                        ¿Tienes una cuenta?
                                    </Typography>
                                    <MuiLink
                                        component={RouterLink}
                                        ml="4px"
                                        variant="body2"
                                        color="primary"
                                        underline="none"
                                        to="/login"
                                        fontSize="12px"
                                        fontWeight="bold"
                                    >
                                        Iniciar Sesión
                                    </MuiLink>
                                </Box>
                            </div>
                            }
                        </CardContent>
                    </Container>
                    </Box>
                </div>
            </div>
        </ThemeProvider>
    );
};