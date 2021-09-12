import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../../context/ChatProvider';
import { BsCameraVideoFill } from 'react-icons/bs';

import { useTheme } from '../../../context/ThemeProvider';
import NewChatWindow from '../../AudioVideoChat';
import VideoCall from '../../AudioVideoChat/VideoCall';
import NewWindow from 'react-new-window';
export default function TopNavigation() {
  const { dark, setDark } = useTheme();
  const { currentConversations, offerSDP } = useChat();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (offerSDP) {
      const shouldOpen = confirm(`Answer Call From ${JSON.stringify(offerSDP)}`);

      if (shouldOpen) setIsOpen(true);
    }
  }, [offerSDP]);

  return (
    <header className="h-16 md:h-16 flex-shrink-0 shadow bg-white dark:bg-gray items-center relative ">
      {isOpen && <NewChatWindow setOpen={setIsOpen}></NewChatWindow>}
      <div className="flex flex-center flex-col h-full justify-center mx-auto relative px-3 text-white z-10">
        <div className="flex items-center pl-1 relative w-full sm:ml-0 sm:pr-2 lg:max-w-68">
          <div className="flex items-center justify-between ml-5 mr-0 p-1 relative text-gray-700 w-full sm:mr-0 sm:right-auto">
            <div>
              <div>
                {currentConversations &&
                  currentConversations.participants &&
                  currentConversations.participants[0].user.name}
              </div>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setIsOpen(true)}>
                <BsCameraVideoFill className="w-7 h-7  text-indigo-500" />
              </button>
              <button onClick={() => setDark((t) => !t)}>
                {dark ? (
                  <SunIcon className="h-7 w-7 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-7 w-7 text-indigo-500" />
                )}
                {dark}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
