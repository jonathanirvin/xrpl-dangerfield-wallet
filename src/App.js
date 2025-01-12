import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GenerateAccount from "./pages/GenerateAccount";
import ImportAccount from "./pages/ImportAccount";
import Main from "./pages/Main";
import ManageAccount from "./pages/ManageAccount";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/manage-account" element={<ManageAccount />}></Route>
          <Route path="/import-account" element={<ImportAccount />}></Route>
          <Route path="/generate-account" element={<GenerateAccount />}></Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
