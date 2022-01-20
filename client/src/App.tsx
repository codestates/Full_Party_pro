import React, { useEffect, Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { useSelector } from 'react-redux';
import { AppState } from './reducers';
import { RootReducerType } from './store/store';

import Home from './pages/Home';
import List from './pages/List';
import Party from './pages/Party';
import Post from './pages/Post';
import Search from './pages/Search';
import Notification from './pages/Notification';
import Favorite from './pages/Favorite';
import Mypage from './pages/Mypage';
import NotFound from './pages/NotFound';
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
  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );

  const { Kakao } = window;
  const modalReducer = useSelector((state: RootReducerType) => state.modalReducer)

  useEffect(() => {
    if(!Kakao.isInitialized()){
      initialize();
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
                {/* <Route path="/" element={isLoggedIn ? <List /> : <Home />} /> */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<List />} />
                <Route path="/party/:partyId" element={<Party />}>
                  <Route path=":commentId" element={<Party />} />
                </Route>
                <Route path="/post" element={<Post />} />
                <Route path="/post/:partyInfo" element={<Post />} /> 
                <Route path="/search" element={<Search />} />
                <Route path="/search/keyword/:keyword" element={<Search />} />
                <Route path="/search/tag/:tag" element={<Search />} />
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