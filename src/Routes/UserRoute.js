import { Navigate } from "react-router-dom";
import { Auth } from "../Utils/auth";

const UserRoute = ({ children }) => {
    return Auth.getUser() ? children : <Navigate to="/signup" />;
};

export default UserRoute;
