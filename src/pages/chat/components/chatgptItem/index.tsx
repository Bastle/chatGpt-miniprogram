import React, { FC } from "React"
import { View, Text } from "@tarojs/components";
import { ChatItemType } from '../../index'
import { ChatType } from '../../../constants'
import './index.scss'


const ChatGptItem:FC<ChatItemType> = ({type, text}) => {
  return <View className={`${type === ChatType.ChatGpt ? 'chatGpt-item' : ''} chat-item`}>
    <View className="chat-logo" />
    <View className="chat-text">
      <Text>{text}</Text>
    </View>
  </View>
}

export default ChatGptItem