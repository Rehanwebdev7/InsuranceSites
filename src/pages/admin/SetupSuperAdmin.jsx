import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase/firebase';
import { ALL_PERMISSIONS } from '../../utils/constants';

const SUPER_ADMIN_CONFIG = {
  email: 'rehanwebdev7@gmail.com',
  password: '131313',
  name: 'Super Admin',
  mobile: '9876543210',
  role: 'super_admin',
  permissions: ALL_PERMISSIONS,
};

const SetupSuperAdmin = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSetup = async () => {
    setStatus('loading');
    setMessage('Creating super admin account...');

    try {
      // Step 1: Create Firebase Auth user
      const credential = await createUserWithEmailAndPassword(
        auth,
        SUPER_ADMIN_CONFIG.email,
        SUPER_ADMIN_CONFIG.password
      );

      const uid = credential.user.uid;
      setMessage('Auth user created. Setting up Firestore document...');

      // Step 2: Create Firestore admin document
      await setDoc(doc(db, 'admins', uid), {
        uid,
        email: SUPER_ADMIN_CONFIG.email,
        name: SUPER_ADMIN_CONFIG.name,
        mobile: SUPER_ADMIN_CONFIG.mobile,
        role: SUPER_ADMIN_CONFIG.role,
        permissions: SUPER_ADMIN_CONFIG.permissions,
        companyName: 'Bharat Insurance',
        isActive: true,
        avatar: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStatus('success');
      setMessage(
        `Super Admin created successfully!\n\n` +
        `Mobile: ${SUPER_ADMIN_CONFIG.mobile}\n` +
        `Email: ${SUPER_ADMIN_CONFIG.email}\n` +
        `Password: ${SUPER_ADMIN_CONFIG.password}\n` +
        `Role: super_admin\n\n` +
        `Ab /login page par jaake mobile number aur password se login karo.`
      );
    } catch (error) {
      console.error('Setup failed:', error);
      setStatus('error');

      if (error.code === 'auth/email-already-in-use') {
        setMessage(
          'Ye email already registered hai Firebase Auth me.\n\n' +
          'Agar ye aapka existing admin account hai, to Firebase Console me jaake:\n' +
          '1. Firestore > admins collection > apna document kholein\n' +
          '2. role field ko "super_admin" set karein\n' +
          '3. permissions field me array add karein: ["dashboard","leads","services","slider","testimonials","settings"]\n\n' +
          'Ya phir neeche "Force Update Existing" button dabao.'
        );
      } else {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  const handleForceUpdate = async () => {
    setStatus('loading');
    setMessage('Existing account ko super admin bana rahe hain...');

    try {
      // Sign in with existing credentials
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const credential = await signInWithEmailAndPassword(
        auth,
        SUPER_ADMIN_CONFIG.email,
        SUPER_ADMIN_CONFIG.password
      );

      const uid = credential.user.uid;

      // Update Firestore document
      const { setDoc, doc: firestoreDoc, serverTimestamp: ts } = await import('firebase/firestore');
      await setDoc(firestoreDoc(db, 'admins', uid), {
        uid,
        email: SUPER_ADMIN_CONFIG.email,
        name: SUPER_ADMIN_CONFIG.name,
        mobile: SUPER_ADMIN_CONFIG.mobile,
        role: 'super_admin',
        permissions: ALL_PERMISSIONS,
        companyName: 'Bharat Insurance',
        isActive: true,
        avatar: null,
        createdAt: ts(),
        updatedAt: ts(),
      }, { merge: true });

      setStatus('success');
      setMessage(
        `Existing account ko super admin bana diya!\n\n` +
        `Mobile: ${SUPER_ADMIN_CONFIG.mobile}\n` +
        `Email: ${SUPER_ADMIN_CONFIG.email}\n` +
        `Password: ${SUPER_ADMIN_CONFIG.password}\n` +
        `Role: super_admin\n\n` +
        `Ab /login par jaake login karo.`
      );
    } catch (error) {
      console.error('Force update failed:', error);
      setStatus('error');
      setMessage(`Force update failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Super Admin Setup</h1>
        <p className="text-sm text-gray-500 mb-6">
          One-time setup to create the super admin account. Iske baad ye page hata dena chahiye.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm space-y-1">
          <div><span className="font-medium text-gray-700">Email:</span> {SUPER_ADMIN_CONFIG.email}</div>
          <div><span className="font-medium text-gray-700">Mobile:</span> +91 {SUPER_ADMIN_CONFIG.mobile}</div>
          <div><span className="font-medium text-gray-700">Password:</span> {SUPER_ADMIN_CONFIG.password}</div>
          <div><span className="font-medium text-gray-700">Role:</span> super_admin</div>
        </div>

        {status === 'idle' && (
          <button
            onClick={handleSetup}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Create Super Admin
          </button>
        )}

        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <pre className="text-sm text-green-800 whitespace-pre-wrap font-sans">{message}</pre>
            <a
              href="/login"
              className="mt-4 block text-center py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Go to Login
            </a>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <pre className="text-sm text-red-800 whitespace-pre-wrap font-sans">{message}</pre>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleSetup}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
              >
                Retry Create
              </button>
              <button
                onClick={handleForceUpdate}
                className="w-full py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm"
              >
                Force Update Existing Account
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-red-500 text-center">
          Important: Setup ke baad ye page ka route AppRouter.jsx se hata dena.
        </p>
      </div>
    </div>
  );
};

export default SetupSuperAdmin;
