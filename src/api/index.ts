import Taro from "@tarojs/taro";
import { domain } from "./config";

export const requestChatGPT = data => {
  return Taro.request({
    url: domain + "/api/chatgpt",
    data,
    method: "POST"
  });
};


export const registerUser = data => {
  return Taro.request({
    url: domain + "/api/register",
    data,
    method: "POST"
  })
}
export const registerCode = code => {
  return Taro.request({
    url: domain + "/api/registerCode",
    data: {code},
    method: "POST"
  })
}