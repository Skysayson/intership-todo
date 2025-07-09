import { configureStore } from '@reduxjs/toolkit'
import  loginReducer from './features/authentication'

export default configureStore({
  reducer: {
    login: loginReducer,
  },
})