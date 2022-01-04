import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

import Home from './pages/Home';
import List from './pages/List';
import Mypage from './pages/Mypage';
import Party from './pages/Party';
import Post from './pages/Post';
import Search from './pages/Search';

import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';

import { AppState } from './reducers';

export default function App() {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

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
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/party" element={<Party />} />
                <Route path="/post" element={<Post />} /> 
              </Fragment>
            </Routes>
          </section>
          {isLoggedIn? <BottomNav /> : null}
        </main>
      </div>
    </BrowserRouter>
  );
}