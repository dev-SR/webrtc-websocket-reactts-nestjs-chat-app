import React from 'react';
import { Helmet } from 'react-helmet';

import ConversationListSideBar from '../Chat/ConversationsList';
import TopNavigation from './topnavigation';

// const style = {
// 	container: `bg-gray-100 h-screen overflow-hidden relative`,
// 	mainContainer: `flex flex-col h-screen pl-0 w-full lg:space-y-4 lg:w-99`,
// 	main: `h-screen overflow-auto pb-36 pt-8 px-2 md:pb-8 md:pt-4 md:px-8 lg:pt-0`
// };
interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
}
const DashboardLayout: React.FC<Props> = ({ children, title, description }) => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    <div className="flex overflow-hidden h-screen w-screen dark:bg-gray relative">
      {/* <div className="flex"> */}
      {/* <SideNavigation /> */}
      <div className="w-20 md:w-80 h-screen flex-shrink-0 overflow-x-hidden overflow-y-auto dark:bg-gray-dark z-10">
        <ConversationListSideBar />
      </div>
      {/* Main+ NAV */}
      {/* <div className="w-screen"> */}

      <div className="flex-1 flex flex-col overflow-y-hidden h-screen justify-between">
        <TopNavigation />
        {children}
      </div>
    </div>
    {/* </div> */}
  </>
);
export default DashboardLayout;
