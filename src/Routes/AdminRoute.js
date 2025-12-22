import { Navigate } from "react-router-dom";
import { Auth } from "../Utils/auth";

const AdminRoute = ({ children }) => {
    const user = Auth.getUser();

    if (!user) return <Navigate to="/signup" />;
    if (user.Roles[0].rolename !== "admin") return <Navigate to="/not-found" />;

    return children;
};

export default AdminRoute;
