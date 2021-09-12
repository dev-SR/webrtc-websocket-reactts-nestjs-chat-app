/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FiVideoOff, FiVideo, FiMic, FiMicOff } from 'react-icons/fi';
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import { useAuth } from '../../context/AuthProvider';
import { useChat } from '../../context/ChatProvider';
import { useSocket } from '../../context/SocketProvider';
export default function Home() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { currentConversations, offerSDP, setOfferSDP } = useChat();

  const [localStreams, setLocalStreams] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection>();
  /* The RTCRtpSender interface provides the ability to control and obtain details about how a particular MediaStreamTrack is encoded and sent to a remote peer */
  const [RTCRtpSenderLists, setRTCRtpSenderLists] = useState<RTCRtpSender[]>([]);

  // 1. CALLER
  const callUser = async () => {
    if (!localStreams) {
      await initStreamsAndRTConn();
    }
    if (localStreams) {
      if (currentConversations && currentConversations.participants) {
        const id = currentConversations.participants[0].user.id;
        socket?.emit('sdp-process', { receiver_id: id });
      }
    }
  };

  useEffect(() => {
    if (!offerSDP) callUser();
    return () => {
      localStreams?.getTracks().forEach((t) => t.stop());
      remoteStreams?.getTracks().forEach((t) => t.stop());
      setOfferSDP(null);
    };
  }, [localStreams]);

  useEffect(() => {
    if (offerSDP) answerCall();
    return () => {
      localStreams?.getTracks().forEach((t) => t.stop());
      remoteStreams?.getTracks().forEach((t) => t.stop());
      setOfferSDP(null);
    };
  }, [offerSDP]);

  const initStreamsAndRTConn = async () => {
    // 1.0 prepare local stream
    const streams = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    const video = localVideoRef.current;
    const promise = video?.play();
    // console.log(promise);
    /*
    DOMException: play() failed because the user didn't interact with the document first.

    https://flutterq.com/uncaught-in-promise-domexception-play-failed-because-the-user-didnt-interact-with-the-document-first/

    */
    if (promise !== undefined) {
      promise
        .then(() => {
          // Autoplay started
          // video!.onloadedmetadata = () => {
          //   video?.play();
          // };
          // video!.play();
        })
        .catch((error) => {
          // Autoplay was prevented.
          console.log(error);
          video!.srcObject = streams;
          video!.muted = true;
          video!.play();
        });
    }

    // 1. init peer
    peerRef.current = createPeer();

    // 1. add local tracks and streams to WebRTC

    if (localVideoRef.current) {
      streams.getTracks().forEach((track) => {
        const videoRTCRtpSender = peerRef.current?.addTrack(track, streams);
        if (videoRTCRtpSender) {
          const newSender = [...RTCRtpSenderLists, videoRTCRtpSender];
          setRTCRtpSenderLists(newSender);
        }
      });
    }

    setLocalStreams(streams);
  };
  const createPeer = () => {
    // console.log('Creating Peer Connection');
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peer.onnegotiationneeded = handleNegotiationNeeded;
    peer.onicecandidate = handleIceCandidateEvent;
    peer.ontrack = handleRemoteTrackEvent;
    return peer;
  };

  const handleNegotiationNeeded = async () => {
    console.log('Creating Offer');

    try {
      const myOffer = await peerRef.current?.createOffer();
      await peerRef.current?.setLocalDescription(myOffer);
      // 2.CALLER: send offer
      if (currentConversations && currentConversations.participants) {
        const id = currentConversations.participants[0].user.id;
        // socket?.emit('sdp-process', { receiver_id: id });
        socket?.emit('sdp-process', {
          offer: peerRef.current?.localDescription,
          receiver_id: id,
          sender_id: user?.id,
        });
      }
    } catch (err) {}
  };
  const handleIceCandidateEvent = (e: RTCPeerConnectionIceEvent) => {
    // console.log('Found Ice Candidate');
    if (e.candidate) {
      if (currentConversations && currentConversations.participants) {
        const id = currentConversations.participants[0].user.id;
        socket?.emit('sdp-process', {
          iceCandidate: e.candidate,
          receiver_id: id,
        });
      }
    }
  };
  const handleRemoteTrackEvent = (e: RTCTrackEvent) => {
    console.log('Received Tracks');
    setRemoteStreams(e.streams[0]);
    const video = remoteVideoRef.current;
    const promise = video?.play();
    console.log(promise);
    video!.srcObject = null;
    if (promise !== undefined) {
      promise
        .then(() => {
          // Autoplay started
          // video!.onloadedmetadata = () => {
          //   video?.play();
          // };
          // video!.play();
        })
        .catch((error) => {
          // Autoplay was prevented.
          console.log(error);
          video!.srcObject = e.streams[0];
          video!.muted = true;
          video!.play();
        });
    }

    // video!.srcObject = e.streams[0];
    // video!.onloadedmetadata = () => {
    //   video?.play();
    // };
  };
  // const [offerSDP, setOfferSDP] = useState<RTCSessionDescription | null>(null);
  useEffect(() => {
    socket?.on('sdp-process', async (message) => {
      if (message.offer_status) {
        alert('User Offline');
        window.close();
      }

      // if (message.offer) {
      //   console.log('Received Offer, Creating Answer');

      //   setOfferSDP(message.offer);
      // }
      if (message.answer) {
        // console.log('Receiving Answer');

        if (peerRef.current?.localDescription)
          await peerRef.current?.setRemoteDescription(
            new RTCSessionDescription(message.answer),
          );
      }
      if (message.iceCandidate) {
        console.log('Receiving and Adding ICE Candidate');
        try {
          if (peerRef.current?.localDescription)
            await peerRef.current?.addIceCandidate(
              new RTCIceCandidate(message.iceCandidate),
            );
        } catch (err) {
          console.log('Error Receiving ICE Candidate', err);
        }
      }
    });

    return () => {
      socket?.off('sdp-process');
    };
  }, [socket]);

  const answerCall = async () => {
    await initStreamsAndRTConn();
    // 3.3 CALLEE: set caller offer as remote sdp
    if (offerSDP) {
      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(offerSDP.offer),
      );
    } else {
      return;
    }

    // 3.4 CALLEE: create ans
    const answer = await peerRef.current?.createAnswer();
    await peerRef.current?.setLocalDescription(answer);

    // 3.5 CALLEE: send answer sdp
    if (currentConversations && currentConversations.participants) {
      socket?.emit('sdp-process', {
        answer: peerRef.current?.localDescription,
        receiver_id: offerSDP.sender_id,
        sender_id: user?.id,
      });
    }
  };

  const stopVid = async () => {
    // if (localVideoTracks.current) {
    //   RTCRtpSenderLists.forEach(async (sender) => {
    //     if (sender.track?.kind == 'video') {
    //       peerRef.current?.removeTrack(sender);
    //       /* The RTCPeerConnection.removeTrack() method tells the local end of the connection to stop sending media from the specified track, without actually removing the corresponding RTCRtpSender from the list of senders as reported by RTCPeerConnection.getSenders() */
    //     }
    //   });
    //   localVideoTracks.current?.stop();
    //   localVideoTracks.current = null;
    //   localVideoRef.current!.srcObject = null;
    // }
  };
  const switchForScreenSharingStream = async () => {
    try {
      const stream =
        //@ts-ignore
        displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());
      let screenSharingStream: MediaStream;
      //@ts-ignore
      // eslint-disable-next-line prefer-const
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const senders = peerRef.current?.getSenders();
      if (senders) {
        senders.forEach((s) => {
          if (s.track?.kind == 'video') {
            s.replaceTrack(screenSharingStream.getVideoTracks()[0]);
          }
        });
      }
    } catch (err) {
      console.error('error occured when trying to get screen sharing stream', err);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray items-center justify-center">
      <main className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          {/* <button onClick={callUser} className="bg-yellow-400 rounded p-2 ">
            Call
          </button> */}
          <button
            onClick={() => {
              answerCall();
            }}
            className="bg-yellow-400 rounded p-2 ">
            Answer
          </button>
          <button onClick={stopVid} className="bg-yellow-400 rounded p-2 ">
            Stop
          </button>
          <button
            onClick={switchForScreenSharingStream}
            className="bg-yellow-400 rounded p-2 ">
            Screen
          </button>
        </div>
        <div className="flex space-x-4">
          <video ref={localVideoRef} className="bg-black w-60 h-60" />
          <video ref={remoteVideoRef} className=" bg-gray-900  w-60 h-60" />
        </div>
        {/* <audio ref={localAudioRef} controls className=" bg-gray-100  w-60 h-10" muted />
        <audio ref={remoteAudioRef} controls className=" bg-gray-100  w-60 h-10" muted /> */}
      </main>
    </div>
  );
}
