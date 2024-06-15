import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_REALTIME_DATABASE_URL,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

interface FirebaseContextProps {
  signupUserWithEmailAndPassword: (
    email: string,
    password: string,
  ) => Promise<void>;
  createTask: (task: any) => Promise<void>;
  updateTask: (taskId: string, updatedTask: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  user: User | null;
  signOut: () => void;
  loading: boolean;
  tasks: any[];
  fetchTasks: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = (props: FirebaseProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUser(user);
        fetchTasks();
      } else {
        setUser(null);
        setTasks([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signupUserWithEmailAndPassword = async (
    email: string,
    password: string,
  ) => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      toast.success("Signed up successfully");
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("The email address is already in use");
          break;
        case "auth/invalid-email":
          toast.error("The email address is not valid.");
          break;
        case "auth/operation-not-allowed":
          toast.error("Operation not allowed.");
          break;
        case "auth/weak-password":
          toast.error("The password is too weak.");
          break;
        case "auth/user-not-found":
          toast.error("User not found.");
          break;
        case "auth/wrong-password":
          toast.error("Wrong password.");
          break;
        default:
          toast.error(error?.code);
      }
    }
  };

  const createTask = async (task: any) => {
    try {
      const docRef = await addDoc(collection(firestore, "tasks"), {
        ...task,
        userId: user?.uid,
      });
      setTasks((prevTasks) => [...prevTasks, { id: docRef.id, ...task }]);
      toast.success("Task created successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateTask = async (taskId: string, updatedTask: any) => {
    try {
      await updateDoc(doc(firestore, "tasks", taskId), updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task,
        ),
      );
      toast.success("Task updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(firestore, "tasks", taskId));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const tasksQuery = query(
        collection(firestore, "tasks"),
        where("userId", "==", user.uid),
      );
      const querySnapshot = await getDocs(tasksQuery);
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      toast.success("Signed in successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuth.signOut();
      setTasks([]);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        createTask,
        updateTask,
        deleteTask,
        fetchTasks,
        signInWithGoogle,
        user,
        signOut,
        loading,
        tasks,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
