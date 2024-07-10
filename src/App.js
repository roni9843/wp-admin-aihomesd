import { useLayoutEffect, useState } from "react";
import "./App.css";
import Auth from "./components/Auth/Auth";
import { Playground } from "./components/SideBar/Sidebar";

function App() {
  const [authState, setAuthState] = useState(false);

  useLayoutEffect(() => {
    // Function to retrieve cookies
    const getCookies = () => {
      const cookies = document.cookie.split("; ");
      for (let cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "authToken" && value) {
          setAuthState(true); // Set auth state to true if authToken cookie exists
          return;
        }
      }
      setAuthState(false); // Set auth state to false if authToken cookie does not exist
    };

    // Call the function to get cookies when the component mounts
    getCookies();
  }, []);

  return (
    <div>
      {authState ? (
        <Playground></Playground>
      ) : (
        <Auth setAuthState={setAuthState}></Auth>
      )}
    </div>
  );
}

export default App;
