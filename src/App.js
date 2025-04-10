// src/App.js
import React from 'react';
import './App.css';
import { useSelector } from 'react-redux';
import Header from './components/layout/Header';
import HomePage from './components/Home/HomePage';
import useAuthInitializer from './handlers/useAuthInitializer';

function App() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  useAuthInitializer();
  return (
    <div className="App">
      <Header />
      <div className='banner'>
        <img src='https://www.shutterstock.com/image-photo/top-view-monthly-calendar-cards-260nw-1782941765.jpg' alt='banner'/>
      </div>
      <HomePage isLoggedIn={isLoggedIn} user={user} />
    </div>
  );
}

export default App;
