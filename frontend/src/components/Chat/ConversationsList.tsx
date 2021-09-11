import React, { useEffect, useState } from 'react';
import { useChat } from '../../context/ChatProvider';
import { AiOutlineUserAdd } from 'react-icons/ai';
import NewWindow from 'react-new-window';
import { useSocket } from '../../context/SocketProvider';
import { Modal } from '../modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';

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

interface ModalProps {
  isOpen: boolean;
  toggle: (isOpen?: boolean) => void;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Inputs {
  email: string;
}

const NewConversationModal: React.FC<ModalProps> = ({ isOpen, toggle, setIsOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { socket } = useSocket();
  const { user } = useAuth();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    socket?.emit('create-new-conversation', { with: data.email, userId: user?.id });
  };

  useEffect(() => {
    socket?.on('conversation-exits', (d) => {
      if (!d.exits) {
        toast.success('Created');
        socket?.emit('get-all-conversations', { userID: user?.id, page: 1 });

        setTimeout(() => {
          if (setIsOpen) setIsOpen(false);
        }, 700);
      } else {
        toast.error('Conversation Already Exits');
      }
    });

    return () => {
      socket?.off('conversation-exits');
    };
  }, [socket]);
  return (
    <Modal isOpen={isOpen} toggle={toggle} closeOnClickOutside={true}>
      <div className=" w-1/2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <input
            type="text"
            {...register('email', { required: true })}
            placeholder="Enter your friends email"
            className="py-2 dark:bg-gray-darkest outline-none ring-0 border-0 focus:outline-none focus:ring-0 dark:text-gray-lightest rounded placeholder-gray-light"
          />
          {errors.email && <span>This field is required</span>}

          <input
            type="submit"
            className="py-2 rounded bg-indigo-500 text-white"
            value="New Conversation"
          />
        </form>
      </div>
      <Toaster />
    </Modal>
  );
};

const ConversationsList: React.FC = () => {
  const { conversations, currentUser, selectConversation, selectedConversation } =
    useChat();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex justify-between p-4">
        <div className="rounded-full w-12 h-12 bg-gray-darkest flex justify-center items-center text-gray-lighter text-3xl p-2">
          {currentUser?.name.slice(0, 1).toUpperCase()}
        </div>
        <button onClick={toggle}>
          <AiOutlineUserAdd className="w-7 h-7 text-gray-semiDark" />
        </button>
        <NewConversationModal isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      </div>
      <div className="md:block">
        <input
          type="text"
          className="p-2 px-4 w-full bg-gray-lighter dark:bg-gray  dark:text-gray-lightest resize-none rounded-lg border-0 focus:outline-none focus:ring-0  hidden"
          placeholder="Search.."
        />

        {conversations && (
          <div className="mt-10 flex flex-col">
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
                        className={`flex md:items-center space-x-4 md:px-4 md:py dark:hover:bg-gray-darkest cursor-pointer items-center md:justify-start border-l-8 border-gray-dark ${
                          selectedConversation === i
                            ? 'border-l-8 border-gray-darkest dark:bg-gray'
                            : ''
                        }`}>
                        <div
                          className={`flex justify-center items-center rounded-full w-12 h-12 dark:bg-gray-dark dark:text-gray-light relative flex-shrink-0`}>
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
