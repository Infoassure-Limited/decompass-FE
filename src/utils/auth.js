import Cookies from 'js-cookie'
// import store from '@/store'

const TokenKey = 'accessToken'
const OtherToken = 'otherToken'
const LoginAs = 'loginAs'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setOtherToken(token) {
  return Cookies.set(OtherToken, token)
}
export function getOtherToken() {
  return Cookies.get(OtherToken)
}
export function removeOtherToken() {
  return Cookies.remove(OtherToken)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getUserRole() {
  return Cookies.get(LoginAs)
}

export function setUserRole(role) {
  return Cookies.set(LoginAs, role)
}
export function removeUserRole() {
  return Cookies.remove(LoginAs)
}
/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */

export const isUserLoggedIn = () => {
  return getToken()
}

// export const getUserData = () => store.getters.userData
