import {ref, get, set, push, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../firebase";

const checkUsersPath = async (path:string) => {
    const usersRef = ref(db, path);
    const snapshot = await get(usersRef);
    return snapshot.exists(); // Returns true if "users" path exists
  };
export const createUser = async (data:any,message:any) => {
    try{
    const usersPathExists = await checkUsersPath('users');
    if (!usersPathExists) {
      console.warn('Users path does not exist, creating...');
      await set(ref(db, 'users/init'), { initialized: true }); // Create an empty "users" node
    }

    const usersRef = ref(db, 'users');
    const userQuery = query(usersRef, orderByChild('rollNo'), equalTo(data.rollNo));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      message.error('User already exists with this roll number!');
      return;
    }

    const newUserRef = push(usersRef);
    await set(newUserRef, {
      ...data,
      role: 'student'
    });

    message.success('User created successfully!');
  } catch (error) {
    console.error('Error creating user:', error);
    message.error('Failed to create user. Please try again!');
  }
};