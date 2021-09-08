import React, { Ref, useContext, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Context {
	videoPlaying: boolean;
	screenSharing: boolean;
	audioPlaying: boolean;
	toggleVideoTracks: (type: 'webcam' | 'screen') => void;
	toggleAudioTracks: () => void;
	localVideoRef: Ref<HTMLVideoElement>;
	remoteVideoRef: Ref<HTMLVideoElement>;

	audioRef: Ref<HTMLAudioElement>;
	videoTracks: MediaStreamTrack | null;
	audioTracks: MediaStreamTrack | null;
}

export const WebCamContext = React.createContext<Context>({} as Context);
export function useWebCam(): Context {
	return useContext(WebCamContext);
}
interface WebCamProps {
	children?: React.ReactNode;
}

const WebCamProvider: React.FC<WebCamProps> = ({ children }) => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);

	const audioRef = useRef<HTMLAudioElement>(null);

	const [videoPlaying, setVideoPlaying] = useState(false);
	const [screenSharing, setScreenSharing] = useState(false);

	const [audioPlaying, setAudioPlaying] = useState(false);

	const [videoTracks, setVideoTracks] = useState<MediaStreamTrack | null>(
		null
	);
	const [audioTracks, setAudioTracks] = useState<MediaStreamTrack | null>(
		null
	);

	const toggleVideoTracks = async (type: 'webcam' | 'screen') => {
		if (
			(videoPlaying && type == 'webcam') ||
			(screenSharing && type == 'screen')
		) {
			stopVideoStream();
			setVideoPlaying(false);
		} else if (!videoPlaying && type == 'webcam') {
			stopVideoStream();
			getVideo('webcam');
			setVideoPlaying(true);
			setScreenSharing(false);
		} else if (!screenSharing && type == 'screen') {
			stopVideoStream();
			getVideo('screen');
			setScreenSharing(true);
			setVideoPlaying(false);
		}
	};

	useEffect(() => {}, []);

	const toggleAudioTracks = async () => {
		// audioTracks!.enabled = !audioPlaying;
		// setAudioPlaying((p) => !p);
		if (!audioPlaying) {
			getAudio();
			setAudioPlaying((p) => !p);
		} else {
			stopAudioStream();
			setAudioPlaying((p) => !p);
		}
	};

	const getVideo = async (videoType: 'webcam' | 'screen') => {
		const constraints: MediaStreamConstraints = {
			video: { width: 300 },
			audio: false
		};
		try {
			let streams: MediaStream;
			let videoTracks: MediaStreamTrack;
			if (videoType == 'webcam') {
				streams = await navigator.mediaDevices.getUserMedia(constraints);
				videoTracks = streams.getVideoTracks()[0];
				// let audioTrack = streams.getAudioTracks()[0];
				// setAudioTracks(audioTrack);
				setVideoTracks(videoTracks);
			} else if (videoType == 'screen') {
				// @ts-ignore
				streams = await navigator.mediaDevices.getDisplayMedia(constraints);
				videoTracks = streams.getVideoTracks()[0];
				streams.getVideoTracks()[0].addEventListener('ended', () => {
					stopVideoStream();
					setScreenSharing(false);
				});
				setVideoTracks(videoTracks);
			}
		} catch (error) {
			alert(error.message);
		}
	};
	const getAudio = async () => {
		const constraints: MediaStreamConstraints = {
			video: false,
			audio: true
		};

		try {
			let s = await navigator.mediaDevices.getUserMedia(constraints);
			setAudioTracks(s.getAudioTracks()[0]);
		} catch (error) {
			alert(error.message);
		}
	};

	useEffect(() => {
		let video = localVideoRef.current;
		if (video && videoTracks) {
			video.srcObject = new MediaStream([videoTracks]);
			video.onloadedmetadata = () => {
				video?.play();
			};
			// play:Loads and starts playback of a media resource.
			//load: Resets the audio or video object and loads a new media resource.
		}
	}, [videoTracks]);

	useEffect(() => {
		let audio = audioRef.current;
		if (audio && audioTracks) {
			audio.srcObject = new MediaStream([audioTracks]);
			// audio.play();
			audio.onloadedmetadata = () => {
				audio?.play();
			};
		}
	}, [audioTracks]);

	const stopVideoStream = async () => {
		if (videoTracks) {
			videoTracks.stop();
			setVideoTracks(null);
			localVideoRef.current!.srcObject = null;
		}
		// videoTracks.getTracks().forEach((track) => {
		// 	track.stop();
		// 	videoTracks?.removeTrack(track);
		// });
	};
	const stopAudioStream = async () => {
		if (audioTracks) {
			audioTracks.stop();
			setAudioTracks(null);
			audioRef.current!.srcObject = null;
		}
	};

	return (
		<WebCamContext.Provider
			value={{
				videoPlaying,
				toggleAudioTracks,
				audioPlaying,
				toggleVideoTracks,
				screenSharing,
				localVideoRef,
				audioRef,
				videoTracks,
				audioTracks,
				remoteVideoRef
			}}>
			{children}
		</WebCamContext.Provider>
	);
};

export default WebCamProvider;
