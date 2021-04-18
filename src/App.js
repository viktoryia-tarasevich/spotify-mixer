import React from "react";
import HomePage from "./HomePage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Playlist from "./Playlist";

function App() {
  return (
    <div className="App">
    <Router>
      <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/playlist/:id/:snaphshotId">
        <Playlist />
      </Route>
    </Switch>
    </Router>
    </div>
  );
}

export default App;
