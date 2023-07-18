import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Box, Button, CardContent, Container, TextField, Typography, Link as MuiLink, IconButton, InputAdornment, createTheme } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { layoutStyles } from "./styles";
import { authProvider } from '../../authProvider'; 
import Lottie from 'lottie-react';
import logo from "../../assets/logo.png";
import loadingAnimation from "../../assets/loading.json";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import LoginPhoto from '../../assets/login.png'
import { ThemeProvider } from "@emotion/react";

interface LoginFormValues {
    access: string;
    password: string;
}

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true)
            const response = await axios.post("https://mylicard.onrender.com/api/v1/usuarios/login", data);
            const accessToken = response.data.accessToken;
            localStorage.setItem("accessToken", accessToken);
            // Llamar al método login del auth provider con los datos del usuario
            await authProvider.login({ access: data.access, password: data.password });
            // Redirigir a la página de inicio después del inicio de sesión exitoso
            window.location.href = "/datos";
        } catch (error) {
        setError(true);
        setLoading(false)
        }
    };

    const theme = createTheme({
        palette:{
            mode: 'light'
        }
    })

    const handleInputChange = (event:any) => {
        event.target.value = event.target.value.toLowerCase();
    };

    return (
    <ThemeProvider theme={theme}>
        <div className='min-h-screen flex items-center lg:justify-between lg:px-20 justify-center flex-wrap lg:flex-nowrap lg:bg-gradient-to-l bg-gradient-to-t from-white to-slate-300'>
            <div className="min-w-sm">
                <h1 className='font-semibold text-3xl lg:text-4xl text-black'>Iniciar Sesión</h1>
                <p className='text-lg pt-2 lg:text-xl text-gray-600'>Tu tarjeta Inteligente</p>
            </div>

            <div className="min-w-sm">
                <img src={LoginPhoto} alt="login" className='md:w-[40rem] w-[15rem] lg:-ml-32 lg:mt-0 -mt-44' />
            </div>
            
            <div className="max-w-sm -mt-60 lg:mt-0">
                <Box component="div" style={layoutStyles} className='flex items-center w-full justify-center'>
                    <Container
                        component="main"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <CardContent sx={{"&:last-child": { pb: "32px" } }} component="form" onSubmit={handleSubmit(onSubmit)} >
                            <a href="https://licard.app" className="flex justify-center mb-5"><img src={logo} alt="licard-imagotipo"  height='10px' width="150px" style={{paddingTop: "20px"}}/></a>
                            {loading ? 
                            <div className="w-full flex items-center justify-center">
                                <Lottie animationData={loadingAnimation}/>
                            </div>  
                            :
                            <div>
            {/* Email ----------------------------------*/} 
                                <TextField
                                    {...register("access", {
                                        required: true,
                                    })}
                                    id="access"
                                    margin="normal"
                                    placeholder="Ingresa tu correo o usuario"
                                    fullWidth
                                    label="Correo Electrónico / Usuario"
                                    error={!!errors.access || error}
                                    inputProps={{  }}
                                    helperText={
                                        errors["access"] ? errors["access"].message : ""
                                    }
                                    InputProps={{
                                        startAdornment: <AiOutlineUser className="mx-2 text-lg"/>,
                                    }}
                                    name="access"
                                    sx={{ mt: 0, "& fieldset": { border: 1.5, borderColor: '#1976D2', borderRadius:'10px'} }}
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
                                    helperText={ error && "Usuario o contraseña incorrectos" }
                                    error={error}
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
                                <MuiLink
                                    variant="body2"
                                    color="primary"
                                    fontSize="12px"
                                    component={RouterLink}
                                    underline="none"
                                    to="/forgot-password"
                                >
                                    ¿Olvidaste tu contraseña?
                                </MuiLink> 
            {/* Botón Enviar */}
                                <Button  type="submit" fullWidth variant="contained" sx={{ mt: "24px", borderRadius:'10px' }}>
                                    {loading ? 'Iniciando...' : 'Iniciar sesión'}
                                </Button>
                                <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mt: "24px", display: "flex", justifyContent: "center", alignItems: "center" }} >
                                    <Typography variant="body2" component="span" fontSize="12px" color='gray'>
                                        ¿No tienes una cuenta?
                                    </Typography>
                                    <MuiLink
                                        component={RouterLink}
                                        ml="4px"
                                        variant="body2"
                                        color="primary"
                                        underline="none"
                                        to="/register"
                                        fontSize="12px"
                                        fontWeight="bold"
                                    >
                                        Regístrate
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
