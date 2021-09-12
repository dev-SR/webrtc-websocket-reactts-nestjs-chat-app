import React, { useEffect, useRef, useState } from 'react';
import NewWindow from 'react-new-window';
import { useSocket } from '../../context/SocketProvider';
import VideoCall from './VideoCall';

interface NewWindowProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewChatWindow: React.FC<NewWindowProps> = ({ setOpen }) => {
  // const localVideoRef = useRef<HTMLVideoElement>(null);
  // const [localStreams, setLocalStreams] = useState<MediaStream | null>(null);

  // useEffect(() => {
  //   const playvid = async () => {
  //     const streams = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: false,
  //     });

  //     const video = localVideoRef.current;
  //     const promise = video?.play();
  //     /*
  //     https://flutterq.com/uncaught-in-promise-domexception-play-failed-because-the-user-didnt-interact-with-the-document-first/
  //      */
  //     if (promise !== undefined) {
  //       promise
  //         .then(() => {
  //           console.log('object');
  //         })
  //         .catch((error) => {
  //           // Autoplay was prevented.
  //           video!.srcObject = streams;
  //           video!.muted = true;
  //           // without this line it's not working although I have "muted" in HTML
  //           video!.play();
  //         });
  //     }
  //     setLocalStreams(streams);
  //   };

  //   playvid();

  //   return () => {
  //     localStreams?.getTracks().forEach((t) => t.stop());
  //     console.log('object');
  //   };
  // }, []);

  const random = Math.floor(Math.random() * 6) + 1;

  return (
    <NewWindow
      copyStyles={true}
      onUnload={() => setOpen(false)}
      features={{
        width: 600,
        height: 600,
        left: random,
        top: 0,
      }}>
      <VideoCall />
    </NewWindow>
  );
};

export default NewChatWindow;
