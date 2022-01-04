import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import List from './pages/List';
import Mypage from './pages/Mypage';
import Party from './pages/Party';
import Post from './pages/Post';
import Search from './pages/Search';

import Nav from './components/Nav';
import SigninModal from './components/SigninModal'
import SignupModal from './components/SignupModal'


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <main>
          <SignupModal />
          {/* <Nav />
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
          </section> */}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
