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
import { Infor_User } from "./Pages/Infor_User";
import UserRoute from "./Routes/UserRoute";
import AddProduct from "./Pages/AddProduct";
import { Dashboard } from "./Pages/Dashboard";
import AdminRoute from "./Routes/AdminRoute";
import { QLyUser } from "./Pages/QLyUser";
import ProductManagement from "./Pages/ProductManagement";
import StatisticsManagement from "./Pages/StatisticsManagement";
import { CategoryManager } from "./Pages/CategoryManager";

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
                    <Route
                        path="/signup"
                        element={
                            <SignUp tologin={tologin} settologin={settologin} />
                        }
                    />
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/inforuser" element={<Infor_User />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route
                        path="/dashboard"
                        element={
                            <AdminRoute>
                                <Dashboard />
                            </AdminRoute>}>
                        <Route path="" element={<div className="mb-8 text-center mt-10">
                            <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
                                TRANG QUẢN LÝ HỆ THỐNG
                            </h1>
                            <p className="text-gray-600">
                                Bắt đầu bằng cách chọn một mục quản lý
                            </p>
                        </div>} />
                        <Route path="qluser" element={<QLyUser />} />
                        <Route path="category" element={<CategoryManager />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="statistics" element={<StatisticsManagement />} />
                    </Route>
                </Routes>

                {location.pathname !== "/signup" && <Footer />}
            </div>
            <Toaster richColors position="top-right" visibleToasts={10} />
        </>
    );
}

export default App;
