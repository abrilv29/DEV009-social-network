import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, async (user) => {
  console.log(user);
});
