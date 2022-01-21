import React, { useEffect, Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navigate, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from './reducers';
import { RootReducerType } from './store/store';
import { SIGNIN_SUCCESS } from './actions/signinType';
import Home from './pages/Home';
import List from './pages/List';
import Party from './pages/Party';
import Post from './pages/Post';
import Search from './pages/Search';
import Notification from './pages/Notification';
import Favorite from './pages/Favorite';
import Mypage from './pages/Mypage';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import axios from "axios";
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import SigninModal from './components/SigninModal';
import SignupModal from './components/SignupModal';

import initialize from './config/initialize';

declare global {
  interface Window {
    Kakao: any;
    kakao: any;
  }
}
export const cookieParser = () => {
  const cookieString = document.cookie.split("; ");
  const keyAndValue = cookieString.map(item => item.split("="));
  let cookieObject: { [key: string]: string } = {};
  keyAndValue.map((item, i) => cookieObject[item[0]] = item[1]);
  return cookieObject;
};

export const requestKeepLoggedIn = async (token: string, signupType: string) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/keeping`, {}, {
    headers: {
      access_token: token,
      signup_type: signupType
    }
  });
  return response;
};

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );
  const userInfo = useSelector(
    (state: AppState) => state.signinReducer.userInfo
  )

  const { Kakao } = window;
  const modalReducer = useSelector((state: RootReducerType) => state.modalReducer)

  useEffect(() => {
    if(!Kakao.isInitialized()){
      initialize();
    }
    if (!document.cookie) {
      document.cookie = "token=temp;";
      document.cookie = "signupType=temp;";
      document.cookie = "isLoggedIn=0;";
      document.cookie = `location=${process.env.REACT_APP_CLIENT_URL}/home`;
    }
    const { token, signupType, location, isLoggedIn } = cookieParser();
    if (token !== "temp" && signupType !== "temp" && isLoggedIn !== "0") {
      requestKeepLoggedIn(token, signupType).then((res) => {
        dispatch({
          type: SIGNIN_SUCCESS,
          payload: res.data.userInfo
        });
      });
      document.cookie = "isLoggedIn=1;";
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <main className="view">
          <TopNav />
          {modalReducer.isModal && modalReducer.modalType === 'signin' ? <SigninModal /> :  null}
          {modalReducer.isModal && modalReducer.modalType === 'signup' ? <SignupModal /> :  null}
          <section className="features">
            <Routes>
              <Fragment>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/home" element={cookieParser().isLoggedIn === "1" ? <List /> : <Home />} />
                <Route path="/party/:partyId" element={<Party />}>
                  <Route path=":commentId" element={<Party />} />
                </Route>
                <Route path="/post" element={<Post />} />
                <Route path="/search" element={<Search />} />
                <Route path="/keyword/:keyword" element={<Search />} />
                <Route path="/tag/:tag" element={<Search />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="*" element={<NotFound />} />
              </Fragment>
            </Routes>
          </section>
          {isLoggedIn ? <BottomNav /> : null}
        </main>
      </div>
    </BrowserRouter>
  );
}