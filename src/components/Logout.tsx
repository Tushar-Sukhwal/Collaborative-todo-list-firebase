import { useFirebase } from "../providers/Firebase";

const Logout = () => {
  const firebase = useFirebase();

  return (
    <div>
      <h1>firebase.user.email</h1>
      <button onClick={() => firebase.signOut()}>Sign Out</button>
    </div>
  );
};

export default Logout;
