import React, {
  useEffect, // useEffect
} from 'react';

import ChatBox from '../components/Chat/ChatBox';
import DashboardLayout from '../components/dashboard/layout';
import { useSocket } from '../context/SocketProvider';

const Home: React.FC = () => {
  const { socket, isWSUnAuthorized } = useSocket();
  useEffect(() => {
    console.log(isWSUnAuthorized);
  }, [socket, isWSUnAuthorized]);
  return (
    <DashboardLayout title="Home">
      <ChatBox />
    </DashboardLayout>
  );
};
export default Home;
