import axios from 'axios';
import { all, fork, takeLatest, call, put, delay } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS } from '../reducers/user'

function loginAPI() {
  return axios.post('/login');
}

function* login() {
  try {
    // yield call(loginAPI);
    yield delay(2000);
    yield put({
      type: LOG_IN_SUCCESS,
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    })
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpdata) {
  return axios
  .post('http://localhost:3065/api/user/', signUpdata)
  .catch((err) => { console.log(err.response.data); return err.response.data });
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data); 
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({ 
      type : SIGN_UP_FAILURE,
      error : e,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchSignUp)
  ]);
}