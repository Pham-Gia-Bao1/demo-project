import React from 'react';
import './App.css';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../src/components/layout/Header.tsx';
import HomePage from './pages/HomePage.tsx';
import UploadComponent from '../src/components/Upload/UploadComponent.tsx';
import useAuthInitializer from '../src/handlers/useAuthInitializer.ts';
import { RootState } from '../src/store/store.ts';
import FileManagementPage from './pages/FileManagementPage.tsx';
import WebSocketDemo from "../src/components/TaskSocketListener.tsx"

const App: React.FC = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  useAuthInitializer();
  console.log(isLoggedIn);

  return (
    <div className="App">
      <Header />
      <div className="banner">
        <img
          src="https://www.shutterstock.com/image-photo/top-view-monthly-calendar-cards-260nw-1782941765.jpg"
          alt="banner"
        />
      </div>

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <HomePage isLoggedIn={isLoggedIn} user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/upload" element={<FileManagementPage />} />
        <Route path="/socket" element={<WebSocketDemo />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
};

export default App;
