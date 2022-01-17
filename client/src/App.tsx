import React, { useEffect, useState, Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

import Home from './pages/Home';
import List from './pages/List';
import Party from './pages/Party';
import Post from './pages/Post';
import Search from './pages/Search';
import Notification from './pages/Notification';
import Favorite from './pages/Favorite';
import Mypage from './pages/Mypage';

import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';

import initialize from './config/initialize';
import { AppState } from './reducers';
import SigninModal from './components/SigninModal';
import SignupModal from './components/SignupModal';
import { RootReducerType } from './store/store'

declare global {
  interface Window {
    Kakao: any;
    kakao: any;
  }
}

export default function App() {
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);

  function signinModalHandler(event: React.MouseEvent<HTMLButtonElement>): void {
    setIsSigninModalOpen(!isSigninModalOpen);
  }

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLogin
  );

  const { Kakao } = window;
  const modalReducer = useSelector((state: RootReducerType) => state.modalReducer)

  useEffect(() => {
    if(!Kakao.isInitialized()){
      initialize();
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <main className="view">
          <TopNav />
          {(() => {
            if(modalReducer.isModal) {
              if(modalReducer.modalType === 'signin') {
                return (
                  <SigninModal signinModalHandler={signinModalHandler} />
                )
              }
              else if(modalReducer.modalType === 'signup') {
                return (
                  <SignupModal />
                )
              }
            }
          })()}
          <section className="features">
            <Routes>
              <Fragment>
                <Route path="/" element={<Home />} />
                <Route path="/list" element={<List />} />
                <Route path="/party/:partyId" element={<Party />}>
                  <Route path=":commentId" element={<Party />} />
                </Route>
                <Route path="/post" element={<Post />} /> 
                <Route path="/search" element={<Search />} />
                <Route path="/search/:keyword" element={<Search />} />
                <Route path="/search/tag/:keyword" element={<Search />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/mypage" element={<Mypage />} />
              </Fragment>
            </Routes>
          </section>
          {isLoggedIn ? <BottomNav /> : null}
        </main>
      </div>
    </BrowserRouter>
  );
}