import { useState } from "react";
import { useFirebase } from "../providers/Firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const firebase = useFirebase();

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    firebase.signupUserWithEmailAndPassword(email, password);
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    firebase.signInUserWithEmailAndPassword(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign Up / Login
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Create a new account or login with your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="mb-4">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <Button
              variant="outline"
              type="submit"
              onClick={handleSignUp}
              className="mb-2 w-full"
            >
              Sign Up
            </Button>
            <Button
              variant="default"
              type="submit"
              onClick={handleLogin}
              className="w-full"
            >
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => firebase.signInWithGoogle()}
            className="w-full"
          >
            Sign in with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
