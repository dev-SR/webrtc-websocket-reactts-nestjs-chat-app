import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import VideoCall from './components/AudioVideoChat/VideoCall';

import AuthProvider from './context/AuthProvider';
import ChatProvider from './context/ChatProvider';
import SocketProvider from './context/SocketProvider';
import ThemeProvider from './context/ThemeProvider';
import PrivateRoute from './helpers/PrivateRoutes';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/login" exact component={() => <Login />}></Route>
            <Route path="/register" exact component={() => <Register />}></Route>
            <SocketProvider>
              <ChatProvider>
                <PrivateRoute path="/" exact component={() => <Home />} />
                <PrivateRoute path="/video" exact component={() => <VideoCall />} />
              </ChatProvider>
            </SocketProvider>
          </Switch>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
