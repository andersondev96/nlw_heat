import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { api } from '../../services/api';
import { io } from 'socket.io-client';

import { MESSAGES_EXAMPLE } from '../../utils/messages';

import {  Message, MessageProps } from '../../components/Message';

import { styles } from './styles';

let messagesQueue: MessageProps[] = MESSAGES_EXAMPLE;

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', (newMessage) => {
  messagesQueue.push(newMessage);
  console.log(newMessage);
})

export function MessageList() {
  const [ currentMessages, setCurrrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('/messages/last-three');
      setCurrrentMessages(messagesResponse.data);
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrrentMessages(prevState => [messagesQueue[0], prevState[0], prevState[1]])
        messagesQueue.shift();
      }
    }, 300);

    return () => clearInterval(timer);
  });

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
      >
        
      {currentMessages.map((message) => <Message key={message.id} data={message} /> )}
     
    </ScrollView>
  )
}