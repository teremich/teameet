import React, { useEffect, useState } from "react";
import Homepage from "./components/homepage";

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  useEffect(() => {
    if (true) setIsUserSignedIn(true);
    else setIsUserSignedIn(false);
  }, []);

  const onLoginSuccessful = () => {
    setIsUserSignedIn(true);
  };

  const onLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    setIsUserSignedIn(false);
  };

  return (
    <Homepage />
  );
}

export default App;