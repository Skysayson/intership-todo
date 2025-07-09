
import { useEffect, useState} from 'react';
import { Input, Button } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/authentication';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();


  
  const dispatch = useDispatch();
  const { token, message } = useSelector((state) => state.login);
  
  useEffect(() => {
    if(token) {
      navigate('/todo')
    }
  }, [token])

  const handleLogin = () => {
    dispatch(loginUser({ email, password }))
    if(token) {
      useNavigate
    }
  }


  return (
    <>
     <div className='flex flex-col w-full h-screen items-center justify-center'>
        <Input placeholder='Email' value={email} onChange={((e) => (setEmail(e.target.value)))} />
        <Input type='password' placeholder='Password' value={password} onChange={((e) => (setPassword(e.target.value)))} />
        <Button onClick={handleLogin}>Login</Button>
        <h1>{message}</h1>
        {token && <h1>Your Token {token}</h1>}
      </div> 
    </>
  )
}

export default LoginPage
