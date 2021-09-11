/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useSocket } from './SocketProvider';

interface UserInfo {
  id: string;
  name: string;
  is_active: string;
}

interface Participant {
  id: string;
  updated_at: Date;
  created_at: Date;
  user: UserInfo;
}

interface Message {
  content: string;
  created_at: Date;
  id: string;
  sender: UserInfo;
  updated_at: Date;
}

interface Conversation {
  id: string;
  creator: UserInfo;
  participants: Participant[] | null;
  updated_at: Date;
  created_at: Date;
  messages: Message[] | null;
}

interface ChatContextType {
  conversations: Conversation[] | null;
  currentConversations: Conversation | null;
  currentUser: UserInfo | null;
  selectConversation: (convId: number) => void;
  selectedConversation: number;
}

const ChatContext = React.createContext<ChatContextType>({} as ChatContextType);
export function useChat() {
  return useContext(ChatContext);
}
const ChatProvider: React.FC = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [currentConversations, setCurrentConversations] = useState<Conversation | null>(
    null,
  );
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  const { socket } = useSocket();
  const { user } = useAuth();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState(0);

  const selectConversation = (convId: number) => {
    setSelectedConversation(convId);
  };

  useEffect(() => {
    if (conversations) setCurrentConversations(conversations[selectedConversation]);
  }, [conversations, selectedConversation]);

  const handleNewConversation = useCallback((d) => {
    if (d && d.length !== 0) {
      setConversations(d);
    }
    console.log(d);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      socket?.emit('get-all-conversations-immediate', { userID: user?.id, page: 1 });
    }, 1000 * 10);

    socket?.on('get-all-conversations-immediate', handleNewConversation);

    return () => {
      socket?.off('get-all-conversations-immediate', handleNewConversation);
      clearInterval(intervalId);
    };
  }, [socket, location, location.pathname, selectedConversation]);

  useEffect(() => {
    socket?.emit('get-all-conversations', { userID: user?.id, page: 1 });
    socket?.on('get-all-conversations', handleNewConversation);

    return () => {
      socket?.off('get-all-conversations', handleNewConversation);
    };
  }, [socket, location, location.pathname]);

  useEffect(() => {
    socket?.on('notify-all-on-new-message', handleNewConversation);
    return () => {
      socket?.off('notify-all-on-new-message', handleNewConversation);
    };
  }, [socket]);

  useEffect(() => {
    if (user) setCurrentUser(user);
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversations,
        currentUser,
        selectConversation,
        selectedConversation,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
