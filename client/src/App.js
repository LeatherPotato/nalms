import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { HashLink } from 'react-router-hash-link';

import Header from "./components/header"
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "./pages/index";
import {Admin, Dashboard, Users, Library} from "./pages/admin";
import Account from "./pages/account";
import Circulation from "./pages/circulation";
import Catalogue from "./pages/catalogue";



function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />}> 
          <Route path="/admin/dashboard" element={<Dashboard />}/>
          <Route path="/admin/users" element={<Users />}/>
          <Route path="/admin/library" element={<Library />}/>
        </Route>
        <Route path="/account" element={<Account />} />
        <Route path="/circulation" element={<Circulation />} />
        <Route path="/catalogue" element={<Catalogue />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

// OLD CODE: COPY IN PLEASE
// import "./App.css";
// import "./styles.css";
// import React from "react";
// import Navbar from "./components/navbar";
// import Footer from "./components/footer";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/index";
// import Admin from "./pages/admin";
// import Account from "./pages/account";
// import Circulation from "./pages/circulation";
// import Catalogue from "./pages/catalogue";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route exact path="/" element={<Home />} />
//         <Route path="/admin" element={<Admin />} />
//         <Route path="/contact" element={<Account />} />
//         <Route path="/circulation" element={<Circulation />} />
//         <Route path="/catalogue" element={<Catalogue />} />
//       </Routes>
//       <Footer></Footer>
//     </Router>
//   );
// }

// export default App;
