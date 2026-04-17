import { Navigate, Outlet } from "react-router-dom";

function AdminProtectRoute() {
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.isAdmin !== true) {
alert("Access Denied");
return <Navigate to="/" replace />;
}
return <Outlet />;
}

export default AdminProtectRoute;