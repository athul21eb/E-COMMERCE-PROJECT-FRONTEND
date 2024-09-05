import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
    <ToastContainer theme="dark"/>
    <Outlet />

</>
    
  );
}

export default App;
////app