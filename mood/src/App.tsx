import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Navbar from "./components/Navbar";
import Data from "./pages/Data";
import Update from "./pages/Update";
// notice: this component is not tracked on github
import PracticePage from "./components/practice/practicePage";

// TODO: come back later and fix every "any" type assignment

function App() {
  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/form" element={<Form />}></Route>
          <Route path="/data" element={<Data />}></Route>
          <Route path="/update/:id" element={<Update />}></Route>
          <Route path="/practice" element={<PracticePage />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
