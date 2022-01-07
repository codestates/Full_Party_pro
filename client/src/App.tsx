import React, { useEffect, Fragment } from 'react';
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

declare global {
  interface Window {
    Kakao: any;
    kakao: any;
  }
}

export default function App() {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  const { Kakao } = window;

  useEffect(() => {
    if(!Kakao.isInitialized()){
      initialize();
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <main>
          <TopNav />
          <section className="features">
            <Routes>
              <Fragment>
                <Route path="/" element={<Home />} />
                <Route path="/list" element={<List />} />
                <Route path="/party" element={<Party />} />
                <Route path="/post" element={<Post />} /> 
                <Route path="/search" element={<Search />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/mypage" element={<Mypage />} />
              </Fragment>
            </Routes>
          </section>
          {isLoggedIn? <BottomNav /> : null}
        </main>
      </div>
    </BrowserRouter>
  );
}