import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import router from 'next/router';
import { SIGN_UP_REQUEST } from '../reducers/user';

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const Signup = () => {
  const dispatch = useDispatch();
  const {isSigningUp, me, isSignUpSuccesFailure, signUpErrorReason} = useSelector(state => state.user);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false); 
  const [passwordError, setPasswordError] = useState(false); 
  const [termError, setTermError] = useState(false); 

  const [id, onChangeId] = useInput(''); 
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if ( password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      setTermError(true);
    }
    dispatch({
      type : SIGN_UP_REQUEST,
      data : {
        userId : id,
        password,
        nickname : nick, 
      }
    }); 
  }, [id, nick, password, passwordCheck, term]);
  
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password); 
    setPasswordCheck(e.target.value);
  }, [password]); 
  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []); 


  useEffect(() => {
    if(me) {
      alert('로그인했으니 메인페이지로 이동합니다.');
      router.push('/')
    }
  }, [me && me.id]); 
  
  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding : 10}} >
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />
          { passwordError && <div style={{color : 'red'}}>비밀번호가 일치하지 않습니다.</div> }
        </div>
        <div>
          <Checkbox name="user-term" defaultChecked={term} onChange={onChangeTerm}>약관 동의</Checkbox>
          { termError && <div style={{color : 'red'}}>약관에 동의하셔야 합니다.</div> }
        </div>
        <div style={{ marginTop : 10}}>
          <Button type="primary" htmlType="submit" loading={isSigningUp} >가입하기</Button>
        </div>
        <div>
          {isSignUpSuccesFailure && <div>{signUpErrorReason}</div>}
        </div>
      </Form>
    </>
  );
};

export default Signup;