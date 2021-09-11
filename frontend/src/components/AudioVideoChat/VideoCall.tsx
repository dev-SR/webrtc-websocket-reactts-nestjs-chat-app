/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FiVideoOff, FiVideo, FiMic, FiMicOff } from 'react-icons/fi';
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import { useSocket } from '../../context/SocketProvider';
export default function Home() {
  const { socket } = useSocket();
  const localVideoTracks = useRef<MediaStreamTrack | null>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection>();

  const localAudioTracks = useRef<MediaStreamTrack | null>();
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  /* The RTCRtpSender interface provides the ability to control and obtain details about how a particular MediaStreamTrack is encoded and sent to a remote peer */
  const [RTCRtpSenderLists, setRTCRtpSenderLists] = useState<RTCRtpSender[]>([]);
  const [stopped, setStopped] = useState(false);
  const remoteStreams = useRef<MediaStream[] | null>();

  const [localVideoStreams, setLocalVideoStreams] = useState<MediaStream>();
  const [localAudioStreams, setLocalAudioStreams] = useState<MediaStream>();
  // 1. CALLER
  const callUser = async () => {
    await initStreamsAndRTConn();
  };

  const initStreamsAndRTConn = async () => {
    // 1.0 prepare local stream
    const streams = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    const audioStreams = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    localVideoTracks.current = streams.getVideoTracks()[0];
    localAudioTracks.current = audioStreams.getAudioTracks()[0];

    const video = localVideoRef.current;
    video!.srcObject = new MediaStream([localVideoTracks.current]);
    video!.onloadedmetadata = () => {
      video?.play();
    };

    const audio = localAudioRef.current;
    audio!.srcObject = new MediaStream([localAudioTracks.current]);
    audio!.onloadedmetadata = () => {
      audio?.play();
    };

    // 1. init peer
    if (localVideoTracks.current) peerRef.current = createPeer();

    // 1. add local tracks and streams to WebRTC
    if (localVideoTracks.current) {
      const videoRTCRtpSender = peerRef.current?.addTrack(
        localVideoTracks.current as MediaStreamTrack,
        streams,
      );
      if (videoRTCRtpSender) {
        const newSender = [...RTCRtpSenderLists, videoRTCRtpSender];
        setRTCRtpSenderLists(newSender);
      }
    }

    if (localAudioTracks.current) {
      const audioRTCRtpSender = peerRef.current?.addTrack(
        localAudioTracks.current as MediaStreamTrack,
        audioStreams,
      );
      if (audioRTCRtpSender) {
        const newSender = [...RTCRtpSenderLists, audioRTCRtpSender];
        setRTCRtpSenderLists(newSender);
      }
    }
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
      socket?.emit('sdp-process', { offer: peerRef.current?.localDescription });
    } catch (err) {}
  };
  const handleIceCandidateEvent = (e: RTCPeerConnectionIceEvent) => {
    // console.log('Found Ice Candidate');
    if (e.candidate) {
      socket?.emit('sdp-process', { iceCandidate: e.candidate });
    }
  };
  const handleRemoteTrackEvent = (e: RTCTrackEvent) => {
    console.log('Received Tracks');
    remoteStreams.current?.push(e.streams[0]);
    if (e.track.kind == 'video') {
      const video = remoteVideoRef.current;
      video!.srcObject = null;
      video!.srcObject = e.streams[0];
      video!.onloadedmetadata = () => {
        video?.play();
      };
    }
    if (e.track.kind == 'audio') {
      const audio = remoteAudioRef.current;
      audio!.srcObject = null;
      audio!.srcObject = e.streams[0];
      audio!.onloadedmetadata = () => {
        audio?.play();
      };
    }
  };
  const [offerSDP, setOfferSDP] = useState<RTCSessionDescription | null>(null);
  useEffect(() => {
    socket?.on('sdp-process', async (message) => {
      if (message.offer) {
        console.log('Received Offer, Creating Answer');
        setOfferSDP(message.offer);
      }
      if (message.answer) {
        // console.log('Receiving Answer');

        if (peerRef.current?.localDescription)
          await peerRef.current?.setRemoteDescription(
            new RTCSessionDescription(message.answer),
          );
      }
      if (message.iceCandidate) {
        // console.log('Receiving and Adding ICE Candidate');
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
      await peerRef.current?.setRemoteDescription(new RTCSessionDescription(offerSDP));
    } else {
      return;
    }

    // 3.4 CALLEE: create ans
    const answer = await peerRef.current?.createAnswer();
    await peerRef.current?.setLocalDescription(answer);

    // 3.5 CALLEE: send answer sdp
    socket?.emit('sdp-process', { answer: peerRef.current?.localDescription });
  };

  const stopVid = async () => {
    if (localVideoTracks.current) {
      RTCRtpSenderLists.forEach(async (sender) => {
        if (sender.track?.kind == 'video') {
          peerRef.current?.removeTrack(sender);
          /* The RTCPeerConnection.removeTrack() method tells the local end of the connection to stop sending media from the specified track, without actually removing the corresponding RTCRtpSender from the list of senders as reported by RTCPeerConnection.getSenders() */
        }
      });
      localVideoTracks.current?.stop();
      localVideoTracks.current = null;
      localVideoRef.current!.srcObject = null;
    }
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
          <button onClick={callUser} className="bg-yellow-400 rounded p-2 ">
            Call
          </button>
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
        <audio ref={localAudioRef} controls className=" bg-gray-100  w-60 h-10" muted />
        <audio ref={remoteAudioRef} controls className=" bg-gray-100  w-60 h-10" muted />
      </main>
    </div>
  );
}
