import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";

import { useFirebase } from "./providers/Firebase";

import { Toaster } from "react-hot-toast";
import { FidgetSpinner } from "react-loader-spinner";
import Home from "./components/Home";

function App() {
  const firebase = useFirebase();
  const loading = firebase.loading;

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <FidgetSpinner />
      </div>
    );

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {firebase?.user == null ? (
          <Route path="/" element={<Login />} />
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
