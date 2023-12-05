import * as React from 'react';
import ResponsiveAppBar from "./Main";
import Login from './Login';
// import { Switch,
//   Route,
//   Link,
//   useHistory,
//   useLocation,
//   Redirect,
//   useRouteMatch,
//   useParams,
// } from "react-router-dom";

// import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from './Register';

function App() {

    return (
      <Router>
        <Routes>
          <Route path='/'caseSensitive={false} element={<ResponsiveAppBar/>} />
          <Route path='/login' caseSensitive={false} element={<Login/>} />
          <Route path='' caseSensitive={false} element={<ResponsiveAppBar/>} />
          <Route path='/register' caseSensitive={false} element={<Register/>} />
        </Routes>
    </Router>
      
      
    );
  }
  
export default App;