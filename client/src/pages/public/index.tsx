import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, IconButton, Typography } from '@mui/material'
import userPhoto from '../../assets/user.webp';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/loading.json'
import errorAnimation from '../../assets/error.json'
import { IconType } from 'react-icons';
import vCard from 'vcf';
import { Helmet } from 'react-helmet-async';

import { AiFillCloseCircle, AiOutlineGlobal } from 'react-icons/ai';
import {BsFillTelephoneFill, BsInstagram, BsTwitter, BsYoutube} from 'react-icons/bs';
import { IoIosCopy, IoMdMail } from 'react-icons/io';
import { MdCancel, MdConnectWithoutContact, MdLocationPin } from 'react-icons/md';
import { TbMessageCircle2Filled } from 'react-icons/tb';
import { RiWhatsappFill } from 'react-icons/ri';
import { FaFacebookF, FaTiktok, FaLinkedin } from 'react-icons/fa';
import { DarkModeOutlined, LightModeOutlined, QrCode2 } from '@mui/icons-material';
import { ColorModeContext } from '../../contexts/color-mode';

import { useTheme } from "@mui/material";
import logoBlack from "../../assets/logo.png"
import logoWhite from "../../assets/logowhite.png"
import imagotipo from "../../assets/imagotipo.png"

import Sheet from 'react-modal-sheet';
import QRCodeStyling from "qr-code-styling";
import { ImLink } from 'react-icons/im';

interface Link {
    _id: string;
    link: string;
    text: string;
    icon: string;
    order: number;
  }
  
  interface Profile {
    _id: string;
    color: string;
    description: string;
    name: string;
    photo: string;
    work: string;
  }
  
  interface User {
    _id: string;
    username: string;
    email: string;
    profile: Profile;
    vcard: VCard;
    allLinks: Link[];
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

  const iconMap: { [key: string]: IconType } = {
    AiOutlineGlobal: AiOutlineGlobal,
    BsFillTelephoneFill: BsFillTelephoneFill,
    BsInstagram: BsInstagram,
    BsTwitter: BsTwitter,
    BsYoutube: BsYoutube,
    IoMdMail: IoMdMail,
    MdLocationPin: MdLocationPin,
    TbMessageCircle2Filled: TbMessageCircle2Filled,
    RiWhatsappFill: RiWhatsappFill,
    FaFacebookF: FaFacebookF,
    FaTiktok: FaTiktok,
    FaLinkedin: FaLinkedin,
  };

const PublicProfile = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [user, setUser] = useState<User>();
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<any>(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`https://mylicard.onrender.com/api/v1/usuarios/${username}`);
          setUser(res.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setError(true);
          setLoading(false);
        }
    };
    
    useEffect(() => {
    fetchData();
    }, [username]);

    useEffect(() => {
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        image: imagotipo,
        dotsOptions: {
          color: "blacks",
          type: "rounded"
        },
        cornersSquareOptions: {
          type:'extra-rounded',
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
        }
      });
      
      qrCode.update({ data: `https://my.licard.app${user?.username}` });
      qrCode.append(ref.current);
    }, [isOpen]);

    // Loading
    if (loading) {
        return   (
            <div>
            <div className="flex flex-col items-center w-full min-h-screen">
              <Lottie animationData={loadingAnimation} className="max-w-sm"/>
            </div>  
          </div>
        )
    }
    // 404
    if (error) {
        return   (
            <div>
            <div className="flex flex-col items-center w-full min-h-screen">
              <Lottie animationData={errorAnimation} className="max-w-sm"/>
            </div>  
          </div>
        )
    }
    // Ordenar Links
    const links = user?.allLinks.sort((a, b) => a.order - b.order)
    // Color Mode
    const { mode, setMode } = useContext(ColorModeContext);
    // VCard
    const card = new vCard();
    if (user?.vcard) {
      if (user?.vcard.email){
        card.add('email', user?.vcard.email)
      }
      if (user?.vcard.lastname && user?.vcard.name) {
        card.add('n', `${user?.vcard.lastname};${user?.vcard.name}`);
      }
      if (user?.vcard.organization) {
        card.add('org', user?.vcard.organization);
      }
      if (user?.vcard.phone){
        card.add('tel', user?.vcard.phone, { type: ['work'] });
      }
      if (user?.vcard.position) {
        card.add('title', user?.vcard.position);
      }
      if (user?.vcard.web) {
        card.add('url', user?.vcard.web);
      }
      if (user?.vcard.workphone) {
        card.add('tel', user?.vcard.workphone, { type: ['work', 'voice'] });
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

    const theme = useTheme();
    const logo = theme.palette.mode === 'dark' ? logoWhite : logoBlack;
    const qrColor = theme.palette.mode === 'dark' ? 'white' : 'black';

    const text = 'https://my.licard.app/'+user?.username
    const handleCopy = () => {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Texto copiado al portapapeles:', text);
          // Puedes mostrar una notificación o realizar otras acciones aquí
        })
        .catch((error) => {
          console.error('Error al copiar el texto:', error);
          // Puedes mostrar una notificación de error o manejar el error de otra manera aquí
        });
    };

    return (
        <div className='lg:max-w-sm shadow-2xl min-h-screen ml-auto mr-auto relative'>
               <Helmet>
                <title>{user?.profile.name}</title>
                <meta name="description" content={`${user?.profile.work}`} />
                <meta property="og:title" content={"Descubre Mi Perfil"} />
                <meta property="og:description" content={"Licard mi tarjeta de presentación inteligente"}/>
              </Helmet>
            <Box className='w-full h-32 rounded-t-[1.75rem] rounded-bl-[1rem] rounded-br-[6rem] relative z-0' sx={{backgroundColor:user?.profile.color ? user?.profile.color : ''}}>
                {/* Color Mode */}
                <IconButton color="inherit" onClick={() => { setMode();}} sx={{right:15, top:10, position:'absolute', backgroundColor:'rgb(238, 238, 228,0.2)'}}>
                    {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
                </IconButton>
                <Button  sx={{left:15, top:10, position:'absolute', borderRadius:'50%', p:1, minWidth:'0px!important', backgroundColor:'rgb(238, 238, 228,0.2)'}} onClick={() => setOpen(true)}>
                    <QrCode2 sx={{color: qrColor}} />
                </Button>
                <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                  <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                      <div className='flex flex-col items-center justify-center gap-4 text-xl'>
                        <div ref={ref} />
                        <ImLink className='text-gray-500 text-3xl'/>
                        <h1 className='text-gray-500 font-bold'>Compartir mi enlace</h1>
                        <Box className='shadow-2xl rounded-full bg-gray-100 text-gray-500 text-sm flex gap-2 items-center pl-6'>
                          <h1>https://my.licard.app/{user?.username}</h1>
                          <button onClick={handleCopy} className='bg-gray-200 rounded-full p-5 hover:bg-gray-400 text-xl'><IoIosCopy /></button>
                        </Box>
                      </div>
                    </Sheet.Content>
                  </Sheet.Container>

                  <Sheet.Backdrop />
                </Sheet>
                {/* Contenido del Perfil */}
                <Box className='w-full flex flex-col items-center justify-center z-50 px-4'>
                    <Box className='w-36 h-36 mt-14'>
                        { user?.profile.photo ?
                            <img src={user?.profile.photo} alt="photo" className='rounded-full w-full h-full object-cover shadow-2xl'></img>
                            :
                            <img src={userPhoto} alt="photo" className='rounded-full w-full h-full object-cover shadow-2xl'></img>
                        }
                    </Box>
                    <Box className='flex flex-col text-center mt-4'>
                        { user?.profile.name &&
                        <Typography fontWeight={600} fontSize={22}>{user?.profile.name}</Typography>
                        }
                        { user?.profile.work &&
                        <Typography sx={{mt:'8px', textTransform:'capitalize', fontWeight:500, fontSize:18 }}>{user?.profile.work}</Typography>
                        }
                        { user?.profile.description &&
                            <Typography sx={{mt:'8px', fontWeight:300, fontSize:16 }}>{user?.profile.description}</Typography>
                        }
                    </Box>

                    <Box className='flex gap-4 flex-wrap mt-6 justify-center mb-32'>
                        { links?.map((item, index) => {
                            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                            return (
                            <a href={item.link} rel="noreferrer" target="_blank" className='flex items-center flex-col gap-3' key={index}>
                                <div className='p-5 rounded-2xl shadow-2xl opacity-80 hover:opacity-100 duration-300' style={{backgroundColor:user?.profile.color}}>
                                {IconComponent && (
                                    <IconComponent className='text-3xl' style={{ color: 'white' }} />
                                )}
                                </div>
                                <Typography fontSize={13} fontWeight={300}>{item.text}</Typography>
                            </a>
                        )})}
                    </Box> 
                </Box>
            </Box>
            
            { user?.vcard && user?.vcard.visible &&
              <Box className='px-6 absolute bottom-7 w-full flex flex-col justify-center items-center gap-4'>
                <Button  onClick={handleDownload} fullWidth variant="contained" sx={{ borderRadius:'20px', py:3, backgroundColor:user?.profile.color, opacity:0.8, "&:hover":{opacity:1, backgroundColor: user?.profile.color}}} className='flex items-center justify-center gap-2'>
                  <MdConnectWithoutContact  className='text-3xl text-white'/>
                  <Typography sx={{fontWeight:600, fontSize:16, color:'white'}}>Guardar Contacto</Typography>
                </Button>
                <a href="https://licard.app" target='_blank' rel='nonreferrer'><img src={logo} alt="Refine" width="90px" /></a> 
              </Box>
            }
        </div>
    )
}

export default PublicProfile