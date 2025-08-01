// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyStory from './pages/MyStory';
import ModularCardGame from './pages/rummy';

const App = () => {
  return (
    <Routes>
      <Route path="my-story" element={<MyStory />} />
      <Route path="rummy" element={<ModularCardGame />} />


      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="my-story" element={<MyStory />} />
      </Route>
    </Routes>
  );
};


export default App;
