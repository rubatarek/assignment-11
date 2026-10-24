import { generateToken,generateAccessToken,auth } from "../../common/middleware/auth/auth.js";
import { hashData,verifyData } from "../../common/middleware/security/encryption.js";
import { ConflictException,NotFoundException,BadRequestException } from "../../common/response/error.response.js";
import userModel from "../../database/model/user.model.js";
import joi from "joi"
import { sendEmail } from "../../common/middleware/utility/sendEmail.js";
import{OAuth2Client} from "google-auth-library"
import{env} from "../../../config/env.service.js"
export const signup= async (data) => {
    let{name, email, password,uniqueAccName,phone}=data
//destruct hagat reqiredd

let existedUser=await userModel.findOne({email})
if(existedUser){
    ConflictException({message: "Email already exists"})
}
let encryptedPassword=await hashData(password)
const otp = Math.floor(100000 + Math.random() * 900000);
let addedUser=await userModel.insertOne({name, email, password: encryptedPassword, uniqueAccName, phone, otp})
await sendEmail({
    to: email ,
    subject: "verify your account",
    html:`<h1> verify/${uniqueAccName}"> verify your account, your otp is ${otp} </h1>`
})
return addedUser

}

export const login= async (data, host) => {
let {email, password}=data
let userData=await userModel.findOne({email})
if(!userData){
    NotFoundException({message: "User not found"})  
}
let validPassword=await verifyData(password, userData.password)
if(!validPassword){
    BadRequestException({message: "Invalid password"})
}
    let{accessToken, refreshToken} =generateToken({userId: userData._id},host, userData.role)
    return {userData, accessToken, refreshToken}
}


export const verifyAccount= async (data) => {
const{email, otp}=data
const userData=await userModel.findOne({email})
if(userData.otp != otp){
    BadRequestException({message: "Invalid otp"})
}

    userData.isVerified=true
    await userData.save()
    userData.otp=null // myt3mlosh verify kazaa mara be same otp
    await userData.save()
    return userData


}

export const getAccessToken= async (authorization, host) => {

let accessToken=await generateAccessToken(authorization, host)
return accessToken

}


export const signinWithGoogle = async (data, host) => {
  const { idToken } = data;
  
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.googleClientId
  });
  
  const payload = ticket.getPayload();
  const { email, name, sub: googleId } = payload;

  let userData = await userModel.findOne({ email });
  
  if (!userData) {
    userData = await userModel.insertOne({
      name,
      email,
      uniqueAccName: email.split("@")[0],
      googleId,
      isVerified: true,
      password: null
    });
  }

  const { accessToken, refreshToken } = generateToken({ userId: userData._id }, host, userData.role);
  return { userData, accessToken, refreshToken };
};