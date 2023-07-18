import { Box, Button, Fade, Modal, Slider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import user from '../../../assets/user.webp';
import { ImCheckmark, ImCross } from "react-icons/im";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import Lottie from 'lottie-react';
import loadingAnimation from '../../../assets/loading.json'

import { FcAddImage } from "react-icons/fc";
import AvatarEditor from 'react-avatar-editor';

interface ImageUploaderProps {
    editable:boolean,
}

const ImageUploader = ({editable}:ImageUploaderProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openImage, setOpenImage ] = useState(false)
    const [image, setImage] = useState<string | null>('')
    const [prevImage, setPrevImage] = useState<string | null>('')
    const [slideValue, setSlideValue] = useState<number>(10);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          const reader = new FileReader();
      
          reader.onload = () => {
            const image = reader.result as string;
            // setImage(image);
            setPrevImage(image);
          };
      
          reader.readAsDataURL(file);
        }
      };

    // Cambiar Valor del Slider
    const handleSliderChange = (event: Event, value: number | number[]) => {
        if (typeof value === 'number') {
          setSlideValue(value);
        }
    };

    // Establecer la imagen recortada como la imagen
    const editorRef = useRef<AvatarEditor | null>(null);
    const handleCrop = () => {
        if (editorRef.current) {
          const canvas = editorRef.current.getImageScaledToCanvas();
          const croppedImage = canvas.toDataURL();
          setImage(croppedImage);
          setPrevImage(croppedImage);
        }
      };
    

    const handleImageUpload = async () => {
        handleCrop()
        const storedUser = localStorage.getItem('user');
        setLoading(true)
        if (storedUser) {
            const parsedData = JSON.parse(storedUser);
            const email = parsedData.email;
            setOpenImage(false)
            try {
                const formData = {
                    email: email,
                    photo: image,
                }
                const response = await axios.patch('https://mylicard.onrender.com/api/v1/usuarios/photo', formData);
                // Recarga la página después de que se hayan guardado los cambios
                setLoading(false)       
            } catch (error) {
                console.error(error);
                setLoading(false) 
            }
        }
    };

    const handleDeleteImage = async () => {
        const storedUser = localStorage.getItem('user');
        setLoading(true)
        if (storedUser) {
            const parsedData = JSON.parse(storedUser);
            const email = parsedData.email;
            try {
                const response = axios.delete(`https://mylicard.onrender.com/api/v1/usuarios/photo?email=${email}`)
                setOpen(false)
                setImage(null)
                setLoading(false)
            } catch (error) {
                setOpen(false)
                setLoading(false)
                console.log(error);
            }
        }
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedData = JSON.parse(storedUser);
          const email = parsedData.email;
          const fetchUserData = async () => {
              try {
                // Aquí debes realizar la llamada a tu API para obtener los datos del usuario
                const response = await axios.get(`https://mylicard.onrender.com/api/v1/usuarios/profile?email=${email}`);
                const userData = response.data; 
                if (userData.profile) {
                    if(userData.profile.photo){
                        setImage(userData.profile.photo)
                    }
                }
              } catch (error) {
                console.error(error);
              }
          };
          fetchUserData();
        }
    }, []);

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
        <Box className='w-32 h-32 relative'>
        {  image ?
            <img src={image} alt="photo" className='rounded-full w-full h-full object-cover shadow-2xl'></img> 
            :
            <img src={user} alt="photo" className='rounded-full w-full h-full object-cover shadow-2xl'></img>
        }
        { editable &&
            <Box>
                { image &&
                    <Button className='-top-2 -right-4' sx={{position:'absolute'}} onClick={() => setOpen(true)}><MdCancel className='text-2xl hover:scale-105 bg-white rounded-full' style={{color:'red'}}/> </Button>
                }
                <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                >
                    <Fade in={open}>
                        <div className="flex justify-center items-center w-full h-full">
                        <div className="bg-white w-auto h-auto md:max-w-lg max-w-xs rounded-2xl p-4">
                            <div className="flex justify-end">
                            <Button onClick={() => setOpen(false)}><AiFillCloseCircle className="text-2xl text-moradoDark hover:text-morado" /> </Button>
                            </div>
                            <div className="flex justify-center items-center flex-col gap-8 mt-5">
                                <h1 className="text-xl px-2 text-center text-black">¿Estás seguro que quieres eliminar tu fotografía?</h1>
                                <div className="flex gap-2 mb-5">
                                    <button onClick={handleDeleteImage} className="bg-green-600 font-medium uppercase rounded-xl text-white px-12 py-3">Si</button>
                                    <button onClick={() => setOpen(false)} className="bg-red-500 font-medium uppercase rounded-xl text-white px-12 py-3">No</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Fade>
                </Modal>
                <Button className='-bottom-3 -right-4' sx={{position:'absolute'}} onClick={() => {setOpenImage(true); setPrevImage(null);}}><IoMdAddCircle className='text-4xl hover:scale-105 bg-white rounded-full' style={{color:'green'}}/> </Button>

                <Modal open={openImage} onClose={() => setOpenImage(false)}>
                    <Box className='w-full flex flex-col items-center justify-center h-full'>
                        <Box className='bg-white dark:bg-black max-w-[20.5rem] rounded-2xl p-4 flex flex-col justify-center items-center gap-3'>
{/* Función para agregar imagen y recortarla */}
                            <div className="w-full">
                                { prevImage ?
                                    <div>
                                        <label htmlFor="file-input">
                                            <AvatarEditor width={250} height={250} borderRadius={200} image={prevImage} ref={editorRef} scale={slideValue / 10}/>
                                        </label>
                                        <Slider min={10} max={50} value={slideValue} defaultValue={slideValue} onChange={handleSliderChange}/>
                                        <Button fullWidth sx={{color:'green', border:2, borderColor:'green', borderRadius:'10px', paddingY:2}}  className='flex justify-end w-full items-center gap-2' onClick={()=> {handleCrop()}}>
                                            <FcAddImage className="text-gray-400 text-4xl" />
                                            <h1>Ajustar Imagen</h1> 
                                        </Button>
                                    </div>
                                    :
                                    <div className={`relative w-250 h-250 border-dashed border-2 mt-2 border-gray-400 rounded-lg flex items-center justify-center px-10 py-20 hover:border-green-500 hover:bg-green-100 duration-300`}>
                                        <label htmlFor="fileInput" className={`cursor-pointer text-gray-600 gap-2 flex items-center`}>
                                            <FcAddImage className="text-gray-400 text-4xl" />
                                            <h1>Seleccionar  Imagen </h1> 
                                        </label>
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/jpeg"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                }
                            </div>

                            <Box className='flex gap-2 w-full'>
                                <Button fullWidth sx={{color:'white', backgroundColor:'red', borderRadius:'10px', paddingY:2}}  className='flex justify-end w-full items-center gap-2' onClick={()=> {setOpenImage(false), setPrevImage(null)}}>
                                    <ImCross />
                                </Button>
                                <Button fullWidth sx={{color:'white', border:2, backgroundColor:'green', borderColor:'green', borderRadius:'10px'}} className='flex justify-end w-full items-center gap-2'   onClick={() => { handleImageUpload()}}>
                                    <ImCheckmark />
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>

            </Box>
            }
        </Box>
    )
}

export default ImageUploader