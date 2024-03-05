import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';

import Header from "./components/header";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginError from "./pages/login_error";

import Home from "./pages/index";
import Admin from "./pages/admin";
import Account from "./pages/account";
import Circulation from "./pages/circulation";
import Catalogue from "./pages/catalogue";

const App = () => {

  const ifLoggedIn = (component) => {
    let userId = Cookies.get('USER_ID')
    if (userId===-1 || userId===undefined) {
      return <LoginError />;
    } else {
      return component;
    }
  }
    return (
      <Router>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="admin" element={ifLoggedIn(<Admin />)} />
            <Route path="circulation" element={ifLoggedIn(<Circulation />)} />
            <Route path="account" element={ifLoggedIn(<Account />)} />
            <Route path="catalogue" element={ifLoggedIn(<Catalogue />)} />
          </Route>
        </Routes>
        <Footer />
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
