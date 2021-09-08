import React, { useEffect, useRef, useState } from 'react';

import { useAuth } from '../../context/AuthProvider';
import { useChat } from '../../context/ChatProvider';
import { useSocket } from '../../context/SocketProvider';
import moment from 'moment';

// const getArr = () => Array.from(Array(20).keys()).map((v) => String(v));
interface Props {
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (v: string) => void;
}
const CustomTextarea: React.FC<Props> = ({ handleSubmit }) => {
  const [rows, setRows] = React.useState(1);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    const rowLen = value.split('\n');
    if (rowLen.length > 1) {
      setRows(2);
    } else setRows(1);
  }, [value]);

  const InputRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    InputRef.current?.focus();
  }, []);

  // Submit on Enter
  const handleUserKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); //Most Important line to reset back to
      // row==1 after submission
      handleSubmit(value);
      setValue('');
    }
  };

  return (
    <textarea
      rows={rows}
      onChange={(text) => setValue(text.target.value)}
      onKeyPress={handleUserKeyPress}
      value={value}
      placeholder="Send new message"
      ref={InputRef}
      className="p-2 px-4 mx-4 w-full bg-gray-lighter  dark:bg-gray-dark  dark:text-gray-lightest resize-none rounded-md border-0 focus:outline-none focus:ring-0 "
    />
  );
};
const ChatBox: React.FC = () => {
  const { socket, isWSUnAuthorized } = useSocket();
  const { currentConversations } = useChat();
  const { user } = useAuth();
  const parentDivRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    const ref = parentDivRef.current;
    if (ref)
      ref.scrollTo({
        top: ref.scrollHeight - ref.clientHeight,
      });
    // console.log('scrolled');
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversations?.messages, currentConversations]);

  const handleSubmit = (value: string) => {
    if (value.length > 1) {
      if (currentConversations?.participants) {
        const sender_id = currentConversations.creator.id; //!!!CRITICAL PART
        const receiver_id = currentConversations.participants[0].user.id;
        console.log({ sender_id, receiver_id });
        socket?.emit('send-message', {
          content: value,
          sender_id,
          receiver_id,
        });

        setTimeout(() => {
          socket?.emit('notify-all-on-new-message', {
            user_list: [sender_id, receiver_id],
          });
        }, 500);
      }
    }
  };

  if (isWSUnAuthorized) return <div>ErroR </div>;

  return (
    <div className="flex flex-col overflow-auto">
      <div
        className="overflow-auto flex flex-col p-4 space-y-4 scrollbar"
        ref={parentDivRef}>
        {currentConversations &&
          currentConversations.messages &&
          currentConversations.messages.map((v, i) => {
            const now = new Date();
            const time_now = moment(now);
            const time_msg = moment(v.updated_at);
            const moreThanOneDayOld = time_now.diff(time_msg, 'days');
            let timeFromNow = null;
            if (moreThanOneDayOld > 0) {
              timeFromNow = moment(v.updated_at).fromNow(true);
            }

            return (
              <div className="w-full" key={i}>
                {v.sender.id == currentConversations.creator.id ? (
                  <div className="flex items-center justify-end ml-10">
                    <div className="py-2 px-4 rounded min-w-min bg-indigo-500 dark:text-gray-lightest text-white ">
                      {v.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-start ml-5 space-x-2">
                    <div className="rounded-full w-10 h-10 dark:bg-gray-dark flex justify-center items-center dark:text-gray-light">
                      {v.sender.name.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="py-2 px-4 rounded min-w-min dark:bg-gray-dark dark:text-gray-light bg-gray-lighter ">
                      {v.content}
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center dark:text-gray-semiDark text-sm">
                  {timeFromNow}
                </div>
              </div>
            );
          })}
      </div>
      <div className="p-4 flex-1">
        <form className="flex justify-between space-x-4 ">
          <CustomTextarea handleSubmit={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default React.memo(ChatBox);
