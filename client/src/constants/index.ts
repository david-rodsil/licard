import { AiOutlineGlobal } from 'react-icons/ai';
import {BsFillTelephoneFill, BsInstagram, BsTwitter, BsYoutube} from 'react-icons/bs';
import { IoMdMail } from 'react-icons/io';
import { MdLocationPin } from 'react-icons/md';
import { TbMessageCircle2Filled } from 'react-icons/tb';
import { RiWhatsappFill } from 'react-icons/ri';
import { FaFacebookF, FaLinkedin, FaTiktok, FaTwitch } from 'react-icons/fa';

export const LinkContactos = [
    {
        id:'telefono',
        type: 'contacto',
        icon: BsFillTelephoneFill,
        iconString: 'BsFillTelephoneFill',
        link: 'tel:',
        label: 'Teléfono',
        placeholder: 'Escribe aquí tu telefono',
    },    
    {
        id:'sms',
        type: 'contacto',
        icon: TbMessageCircle2Filled,
        iconString: 'TbMessageCircle2Filled',
        link: 'sms:',
        label: 'Mensaje',
        placeholder: 'Escribe aquí tu telefono',
    },       
    {
        id:'correo',
        type: 'contacto',
        icon: IoMdMail,
        iconString: 'IoMdMail',
        link: 'mailto:',
        label: 'Correo',
        placeholder: 'Escribe aquí tu correo',
    },     
    {
        id:'whatsapp',
        type: 'contacto',
        icon: RiWhatsappFill,
        iconString: 'RiWhatsappFill',
        link: 'https://wa.me/',
        label: 'WhatsApp',
        placeholder: 'Escribe aquí tu teléfono',
    },        
    {
        id:'ubicacion',
        type: 'contacto',
        icon: MdLocationPin,
        iconString: 'MdLocationPin',
        link: '',
        label: 'Ubicación',
        placeholder: 'Ingresa el enlace de tu ubicación',
    },     
    {
        id:'web',
        type: 'contacto',
        icon: AiOutlineGlobal,
        iconString: 'AiOutlineGlobal',
        link: '',
        label: 'Web',
        placeholder: 'https://www.mienlace.com',
    },    
]
export const LinkRedes = [
    {
        id:'instagram',
        type: 'redes',
        icon: BsInstagram,
        iconString: 'BsInstagram',
        link: 'https://www.instagram.com/',
        label: 'Instagram',
        placeholder: 'Escribe aquí tu nombre de usuario',
    },    
    {
        id:'facebook',
        type: 'redes',
        icon: FaFacebookF,
        iconString: 'FaFacebookF',
        link: 'https://www.facebook.com/',
        label: 'Facebook',
        placeholder: 'Escribe aquí tu nombre de usuario',
    },
    {
        id:'twitter',
        type: 'redes',
        icon: BsTwitter,
        iconString: 'BsTwitter',
        link: 'https://www.twitter.com/',
        label: 'Twitter',
        placeholder: 'Escribe aquí tu nombre de usuario',
    },
    {
        id:'tiktok',
        type: 'redes',
        icon: FaTiktok,
        iconString: 'FaTiktok',
        link: 'https://www.tiktok.com/',
        label: 'TikTok',
        placeholder: 'Escribe aquí tu nombre de usuario',
    },
    {
        id:'youtube',
        type: 'redes',
        icon: BsYoutube,
        iconString: 'BsYoutube',
        link: 'https://www.youtube.com/',
        label: 'Youtube',
        placeholder: 'Escribe aquí tu nombre de usuario',
    },
    {
        id:'linkedin',
        type: 'redes',
        icon: FaLinkedin,
        iconString: 'FaLinkedin',
        link: 'https://www.linkedin.com/',
        label: 'Linkedin',
        placeholder: 'Escribe aquí tu nombre de usuario',
    },
]