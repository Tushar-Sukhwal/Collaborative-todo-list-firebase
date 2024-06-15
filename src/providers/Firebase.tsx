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

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(firebaseAuth, googleProvider);
      setUser(res.user);
      toast.success("Signed in with Google");
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast.error("Error signing in with Google");
    }
  };

  const signupUserWithEmailAndPassword = async (
    email: string,
    password: string,
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      setUser(res.user);
      toast.success("Successfully signed up");
    } catch (error) {
      console.error("Error signing up with email and password", error);
      toast.error("Error signing up with email and password");
    }
  };

  const createTask = async (task: any) => {
    if (!user) {
      toast.error("You must be logged in to create a task");
      return;
    }

    try {
      const userTasksRef = collection(firestore, "tasks");
      await addDoc(userTasksRef, {
        ...task,
        userId: user.uid,
      });
      await fetchTasks();
      toast.success("Task created");
    } catch (error) {
      console.error("Error creating task", error);
      toast.error("Error creating task");
    }
  };

  const updateTask = async (taskId: string, updatedTask: any) => {
    if (!user) {
      toast.error("You must be logged in to update a task");
      return;
    }

    try {
      const taskDocRef = doc(firestore, "tasks", taskId);
      await updateDoc(taskDocRef, updatedTask);
      await fetchTasks();
      toast.success("Task updated");
    } catch (error) {
      console.error("Error updating task", error);
      toast.error("Error updating task");
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a task");
      return;
    }

    try {
      const taskDocRef = doc(firestore, "tasks", taskId);
      await deleteDoc(taskDocRef);
      await fetchTasks();
      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error("Error deleting task");
    }
  };

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    try {
      const userTasksRef = collection(firestore, "tasks");
      const q = query(userTasksRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks", error);
      toast.error("Error fetching tasks");
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        createTask,
        updateTask,
        deleteTask,
        signInWithGoogle,
        user,
        signOut: () => firebaseAuth.signOut(),
        loading,
        tasks,
        fetchTasks,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
