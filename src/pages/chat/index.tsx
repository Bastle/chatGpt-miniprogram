import React, { useCallback, useState, useRef, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtInput, AtButton } from "taro-ui";
import { getCurrentInstance } from "@tarojs/taro";
import ChatGptItem from "./components/chatgptItem";
import { ChatType } from '../constants'
import "./index.scss";


export interface ChatItemType {
  type: ChatType;
  text: String;
}

const Index = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [bottomHeight, setBottomHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [chatContent, setChatContent] = useState<ChatItemType[]>([]);
  const conversationId = useRef("");
  const id = useRef("");


  useEffect(() => {
    if(getCurrentInstance().router?.params?.question){
      sendQuestion(getCurrentInstance().router?.params?.question)
    }
  }, [])

  const handleChange = useCallback(e => {
    setValue(e);
  }, []);
  

  useEffect(() => {
    const getSafeScreen = async () => {
      try {
        const res = Taro.getSystemInfoSync();
        console.log(
          "bottom height",
          res.screenHeight - Number(res?.safeArea?.bottom)
        );
        setBottomHeight(res.screenHeight - Number(res?.safeArea?.bottom));
      } catch (e) {
        console.warn(e);
      }
    };
    getSafeScreen();
  }, []);

  useEffect(() => {
    setScrollTop(chatContent.length * 500);
  }, [chatContent]);

  const sendQuestion = (question = "") => {
    const message = question || value
    if (loading || !message) return false;
    console.log('message ------>', message)
    setValue("");
    setLoading(true);
    setChatContent(content => [
      ...content,
      { type: ChatType.User, text: message },
    ]);
    Taro.request({
      // url: "https://wechatgptapi.zengxiaowuyou.com/api/chatgpt",
      // url: "http://localhost:3002/api/chatgpt",
       url: "http://207.148.112.67:3002/api/chatgpt",
      data: {
        message,
        conversationId: conversationId.current,
        id: id.current
      },
      method: "POST"
    })
      .then(res => {
        if (res?.data?.text) {
          setChatContent(content => [
            ...content,
            { type: ChatType.ChatGpt, text: res?.data?.text }
          ]);
          conversationId.current = res?.data?.conversationId;
          id.current = res?.data?.id;
        } else if (res?.data?.status === -1) {
          setChatContent(content => [
            ...content,
            { type: ChatType.ChatGpt, text: "服务器挤爆了，请稍后再试" }
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        setChatContent(content => [
          ...content,
          { type: ChatType.ChatGpt, text: "网络错误，请稍后再试" }
        ]);
        setLoading(false);
      });
  };

  return (
    <View className="wrapper">
      <ScrollView
        style={{ height: `calc(100vh - ${90}rpx)`, backgroundColor: 'rgb(240,240,240)' }}
        className="chat-content"
        scrollY
        scrollTop={scrollTop}
      >
        {chatContent.map(item => {
          return <ChatGptItem {...item} />;
        })}
      </ScrollView>
      <View className="pub-comment" style={{ paddingBottom: bottomHeight }}>
        <View className="pub-left">
          <AtInput
            className="pub-input"
            value={value}
            onChange={handleChange}
            name="value"
            placeholder="问个问题吧"
          />
        </View>
        <AtButton loading={loading} onClick={() => sendQuestion()}>发送</AtButton>
      </View>
    </View>
  );
};

export default Index;
