// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyStory from './pages/MyStory';
import ModularCardGame from './pages/rummy';
import BotBattle from './pages/botBattle';
import VideoEditor from './pages/VideoEditor';
import Swop from './pages/swop';
const App = () => {
  return (
    <Routes>
      <Route path="my-story" element={<MyStory />} />
      <Route path="rummy" element={<ModularCardGame />} />
      <Route path="bot-battle" element={<BotBattle />} />
      <Route path="video-editor" element={<VideoEditor />} />
      <Route path="vertex" element={<Swop />} />


      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="my-story" element={<MyStory />} />
      </Route>
    </Routes>
  );
};


export default App;
