// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyStory from './pages/MyStory';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="my-story" element={<MyStory />} />
      </Route>
    </Routes>
  );
};


export default App;
