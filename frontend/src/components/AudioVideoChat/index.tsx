import React, { useEffect, useRef } from 'react';
import NewWindow from 'react-new-window';
import { useSocket } from '../../context/SocketProvider';
import VideoCall from './VideoCall';

interface NewWindowProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewChatWindow: React.FC<NewWindowProps> = ({ setOpen }) => {
  return <NewWindow copyStyles={true} onUnload={() => setOpen(false)} url="/video" />;
};

export default NewChatWindow;
