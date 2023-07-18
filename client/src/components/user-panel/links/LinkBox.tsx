import { AiFillCloseCircle, AiOutlineGlobal } from 'react-icons/ai';
import {BsFillTelephoneFill, BsInstagram, BsTwitter, BsYoutube} from 'react-icons/bs';
import { IoMdMail } from 'react-icons/io';
import { MdCancel, MdLocationPin } from 'react-icons/md';
import { TbMessageCircle2Filled } from 'react-icons/tb';
import { RiWhatsappFill } from 'react-icons/ri';
import { FaFacebookF, FaTiktok, FaLinkedin } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { Box, Button, Fade, Modal, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import loadingAnimation from '../../../assets/loading.json'

interface LinkBoxProps  {
    color: string,
    text: string,
    link: string,
    icon: string,
    order: number,
    editable: boolean,
    id: string,
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

const LinkBox = ({color, icon, text, link, editable, id, setMyLinks, MyLinks}: LinkBoxProps) => {
  const Icon = iconMap[icon as keyof typeof iconMap]
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);

  const handleDeletelink = async () => {
    try {
        setLoading(true)
        const response = axios.delete(`https://mylicard.onrender.com/api/v1/links?id=${id}`)
        if (MyLinks){
          setMyLinks(MyLinks.filter(link => link._id !== id))
        }
        setOpen(false)
    } catch (error) {
        setOpen(false)
        setLoading(false)
        console.log(error);
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
    <div className='relative'>
      <a href={link} rel="noreferrer" target="_blank" className='flex items-center flex-col gap-3'>
        <div className='p-5 rounded-2xl shadow-2xl opacity-80 hover:opacity-100 duration-300' style={{backgroundColor:color}}>
          <Icon className='text-3xl' style={{color:'white'}}/>
        </div>
        <Typography fontSize={13} fontWeight={300}>{text}</Typography>
      </a>
      { editable &&
        <Box>
          <Button className='-top-4 -right-7' sx={{position:'absolute'}} onClick={() => setOpen(true)}><MdCancel className='text-xl hover:scale-105 bg-white rounded-full' style={{color:'red'}}/> </Button>
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
                          <h1 className="text-xl px-2 text-center">¿Estás seguro que quieres eliminar este enlace?</h1>
                          <div className="flex gap-2 mb-5">
                              <button onClick={handleDeletelink} className="bg-green-600 font-medium uppercase rounded-xl text-white px-12 py-3">Si</button>
                              <button onClick={() => setOpen(false)} className="bg-red-500 font-medium uppercase rounded-xl text-white px-12 py-3">No</button>
                          </div>
                      </div>
                  </div>
                  </div>
              </Fade>
          </Modal>
        </Box>
      }
    </div>
  )
}

export default LinkBox