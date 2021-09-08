import React, { useEffect, useState } from 'react';
import { useChat } from '../../context/ChatProvider';
import { FcVideoCall } from 'react-icons/fc';
import NewWindow from 'react-new-window';
import { useSocket } from '../../context/SocketProvider';

interface NewWindowProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const Demo: React.FC<NewWindowProps> = ({ setOpen }) => {
  const { socket } = useSocket();
  const sendMsg = () => {
    socket?.emit('send-message', 'HI');
  };

  return (
    <NewWindow copyStyles={true} onUnload={() => setOpen(false)}>
      <h1 onClick={sendMsg}>Hi 👋</h1>
    </NewWindow>
  );
};
const ConversationsList: React.FC = () => {
  const { conversations, currentUser, selectConversation } = useChat();
  const [open, setOpen] = useState(false);

  // console.log(open);
  return (
    <div className="p-4 flex flex-col w-full space-y-4">
      <div className="flex justify-between">
        <div className="rounded-full w-12 h-12 bg-gray-darkest flex justify-center items-center text-gray-lighter text-3xl p-2">
          {currentUser?.name.slice(0, 1).toUpperCase()}
        </div>

        <button onClick={() => setOpen(true)}>
          <FcVideoCall className="w-7 h-7" />
          {open && <Demo setOpen={setOpen} />}
        </button>
      </div>

      <div className="md:block">
        <input
          type="text"
          className="p-2 px-4 w-full bg-gray-lighter dark:bg-gray  dark:text-gray-lightest resize-none rounded-lg border-0 focus:outline-none focus:ring-0  hidden"
          placeholder="Search.."
        />

        {conversations && (
          <div className="mt-10 flex flex-col space-y-4">
            {conversations.map((con, i) => (
              <div key={i} className="" onClick={() => selectConversation(i)}>
                {con.participants &&
                  con.participants.map((m, j) => {
                    const avatar = m.user.name.slice(0, 1).toUpperCase();
                    const conversationsWith = m.user.name;
                    let lastMessage = null;
                    if (con.messages && con.messages.length >= 1) {
                      lastMessage = con.messages[0].content.slice(0, 20);
                    }
                    return (
                      <div
                        key={j}
                        className="flex md:items-center space-x-2 md:p-2 dark:hover:bg-gray-darkest rounded cursor-pointer items-center md:justify-start">
                        <div className="flex justify-center items-center rounded-full w-12 h-12  dark:bg-gray dark:text-gray-light relative flex-shrink-0 ">
                          {avatar}

                          {m.user.is_active && (
                            <div className="absolute  bottom-0 right-0">
                              <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="hidden md:flex flex-col space-y-1 ">
                          <div className="mt-2 dark:text-gray-lightest ">
                            {conversationsWith}
                          </div>
                          <div className="mt-2 dark:text-gray-semiDark">
                            {lastMessage}...
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ConversationsList;

// export default React.memo(ConversationsList);
