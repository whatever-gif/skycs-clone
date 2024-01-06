import { Outlet } from "react-router-dom";

export const ComponentPage = () => {
  return <div>
    <h1>Component Page</h1>
    <Outlet />
  </div>;
};
export default ComponentPage;