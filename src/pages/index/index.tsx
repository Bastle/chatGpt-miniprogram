import React, { useCallback, useState, useRef, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { registerUser, registerCode } from "../../api";
import "./index.scss";

const Index = () => {
  const [message, setMessage] = useState("12");
  const socketRef = useRef(false);

  useEffect(() => {
    Taro.login({
      success: loginRes => {
        console.log(loginRes);
        // Taro.getUserInfo({
        //   success: function(res) {
        //     var userInfo = res.userInfo;
        //     registerUser({ ...userInfo, code: loginRes.code })
        //       .then(ressult => {
        //         console.log(ressult);
        //       })
        //       .catch(err => {
        //         console.warn(err);
        //       });
        //   },
        //   fail: function(err) {
        //     console.warn(err);
        //   }
        // });
      }
    });

    Taro.getUserInfo({
      success: function(res) {
        console.log('getUserInfo ----->', res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log(res)
        // registerUser(userInfo).then(ressult => {
        //   console.log(ressult)
        // }).catch(err => {
        //   console.warn(err)
        // })
      },
      fail: function(res){
        console.warn(res)
      }
    })
  }, []);

  const sendMessage = () => {
    if (socketRef.current) {
      Taro.sendSocketMessage({ data: "111111111" });
    } else {
      Taro.connectSocket({
        url: "ws://localhost:3002/ws",
        success: () => {
          console.log("success");
        }
      }).then(task => {
        task.onOpen(function() {
          socketRef.current = true;
          console.log("onOpen");
          task.send({ data: "xxx" });
        });
        task.onMessage(function(msg) {
          console.log("onMessage: ", msg);
          setMessage(msg?.data);
        });
        task.onError(function() {
          console.log("onError");
        });
        task.onClose(function(e) {
          console.log("onClose: ", e);
        });
      });
    }
  };
  return (
    <View className="wrapper">
      <View className="logo-wrap">
        <View className="chatgpt-logo"></View>
        <Text>ChatGPT</Text>
      </View>

      <View className="btn-wrap">
        {/* <View
          className="btn"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/chat/index"
            });
          }}
        >
          立即体验
        </View> */}
        <Button
          className="btn"
          onClick={() => {
            Taro.getUserProfile({
              desc: "111"
            })
              .then(result => {
                console.log("getUserProfile", result);
              })
              .catch(err => {
                console.warn("err ----->", err);
              });
          }}
        >
          {message}
        </Button>
        <Button className="btn" openType="share">
          分享
        </Button>
        <View className="btn" onClick={sendMessage}>
          国内 ip 被禁，无法访问服务
        </View>
        <View
          className="btn"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/chat/index?question=写一首关于春天的诗"
            });
          }}
        >
          正在努力解决，请耐心等待
        </View>
      </View>
    </View>
  );
};

export default Index;
