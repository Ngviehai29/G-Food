import "./App.css";
import { Navbar } from "./Components/Navbar";
import { About } from "./Pages/About";
import { Home } from "./Pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { SignUp } from "./Pages/SignUp";
import { useEffect, useState } from "react";
import { Footer } from "./Components/Footer";
import { Blog } from "./Pages/Blog";
import { Toaster } from "sonner";
// Phân Quyền
import { Infor_User } from './Pages/Infor_User';
import UserRoute from "./Routes/UserRoute";
import AddProduct from "./Pages/AddProduct";
// import AdminRoute from './Routes/AdminRoute';

function App() {
    const location = useLocation();
    const pathname = useLocation();
    const [tologin, settologin] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <div className="App">
                {location.pathname !== "/signup" && (
                    <Navbar settologin={settologin} />
                )}


                <Routes>
                    <Route path='/signup' element={<SignUp tologin={tologin} settologin={settologin} />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/blog' element={<Blog />} />
                    <Route path='/inforuser' element={<Infor_User />} />
                    <Route path="/add-product" element={<AddProduct />} />
                </Routes>

                {location.pathname !== "/signup" && <Footer />}
            </div>
            <Toaster richColors position="top-right" visibleToasts={10} />
        </>
    );
}

export default App;
