// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyStory from './pages/MyStory';
import ModularCardGame from './pages/rummy';
import VideoEditor from './pages/VideoEditor';
import Swop from './pages/swop';
import AIEducation from './pages/AIEducation';
import NeuralNetworkSimulator from './pages/NeuralNetworkSimulator';
import AILearningDemo from './components/AILearningDemo';
import TokenizationJourney from './pages/TokenizationJourney';
import TaskManager from './pages/jira';
import ImposterGame from './pages/charades'
const App = () => {
  return (
    <Routes>
      <Route path="my-story" element={<MyStory />} />
      <Route path="rummy" element={<ModularCardGame />} />
      <Route path="video-editor" element={<VideoEditor />} />
      <Route path="vertex" element={<Swop />} />
      <Route path="neural-network" element={<NeuralNetworkSimulator />} />
      <Route path="how-ai-learns" element={<AILearningDemo />} />
      <Route path="tokenization-journey" element={<TokenizationJourney />} />
      <Route path="jira" element={<TaskManager />} />
      <Route path="quiz" element={<ImposterGame />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="my-story" element={<MyStory />} />
      </Route>
    </Routes>
  );
};


export default App;
