import { Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material'
import { FcPlus } from 'react-icons/fc'

interface LinkAddBoxProps {
    color: string
    onClick: () => void;
}

const LinkAddBox = ({color, onClick}: LinkAddBoxProps) => {
    const theme = useTheme();
    const textColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  return (
    <Button fullWidth sx={{border:2, borderRadius:'10px', borderColor:color, paddingY:2}} className="shadow-2xl flex gap-2 items-center" onClick={onClick}>
        <FcPlus className='text-2xl'/>
        <Typography sx={{color:textColor, fontWeight:600}}>Añadir Enlace</Typography>
    </Button>
  )
}

export default LinkAddBox