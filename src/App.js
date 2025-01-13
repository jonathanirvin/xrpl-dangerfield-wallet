import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GenerateAccount from "./pages/GenerateAccount";
import ImportAccount from "./pages/ImportAccount";
import Main from "./pages/Main";
import ManageAccount from "./pages/ManageAccount";
import Send from "./pages/Send";
import { ToastContainer } from "./components/Toast";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/manage-account" element={<ManageAccount />}></Route>
          <Route path="/import-account" element={<ImportAccount />}></Route>
          <Route path="/generate-account" element={<GenerateAccount />}></Route>
          <Route path="/send" element={<Send />}></Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
