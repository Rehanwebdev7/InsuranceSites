import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiEdit2, FiPlus, FiX, FiSave, FiUsers, FiShield, FiKey,
  FiToggleLeft, FiToggleRight, FiMail, FiPhone, FiUser, FiEye, FiEyeOff,
} from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase/firebase';
import * as firestoreService from '../../services/firebase/firestore';
import { ALL_PERMISSIONS, PERMISSION_LABELS, ROLES } from '../../utils/constants';

// Secondary app config (same as main app) — used to create users
// without disrupting the current super admin's session
const secondaryConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const emptyAdmin = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  role: 'admin',
  permissions: [],
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState(emptyAdmin);
  const [isSaving, setIsSaving] = useState(false);
  const [resetLoading, setResetLoading] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await firestoreService.getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Failed to load admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setEditingAdmin(null);
    setFormData(emptyAdmin);
    setModalOpen(true);
  };

  const openEditModal = (admin) => {
    setEditMode(true);
    setEditingAdmin(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      mobile: admin.mobile || '',
      password: '',
      role: admin.role || 'admin',
      permissions: admin.permissions || [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditingAdmin(null);
    setFormData(emptyAdmin);
    setShowPassword(false);
  };

  const togglePermission = (perm) => {
    setFormData((prev) => {
      const current = prev.permissions || [];
      if (current.includes(perm)) {
        return { ...prev, permissions: current.filter((p) => p !== perm) };
      }
      return { ...prev, permissions: [...current, perm] };
    });
  };

  const selectAllPermissions = () => {
    setFormData((prev) => ({ ...prev, permissions: [...ALL_PERMISSIONS] }));
  };

  const clearAllPermissions = () => {
    setFormData((prev) => ({ ...prev, permissions: [] }));
  };

  /**
   * Create a new admin using a secondary Firebase app instance.
   * This prevents the super admin from being logged out when
   * createUserWithEmailAndPassword auto-signs-in the new user.
   */
  const createAdminUser = async (email, password, adminData) => {
    let secondaryApp = null;
    try {
      // Create a temporary secondary app
      secondaryApp = initializeApp(secondaryConfig, `temp-${Date.now()}`);
      const secondaryAuth = getAuth(secondaryApp);

      // Create user on the secondary app (won't affect main auth state)
      const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid = credential.user.uid;

      // Create Firestore admin document using main db
      await setDoc(doc(db, 'admins', uid), {
        uid,
        email,
        name: adminData.name,
        mobile: adminData.mobile,
        role: adminData.role || 'admin',
        permissions: adminData.permissions || [],
        companyName: '',
        isActive: true,
        avatar: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return uid;
    } finally {
      // Clean up secondary app
      if (secondaryApp) {
        try { await deleteApp(secondaryApp); } catch {}
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      toast.error('Name, email and mobile are required');
      return;
    }
    if (formData.mobile.length !== 10) {
      toast.error('Mobile number must be 10 digits');
      return;
    }

    setIsSaving(true);
    try {
      if (editMode && editingAdmin) {
        // Update existing admin (Firestore only)
        const updates = {
          name: formData.name,
          mobile: formData.mobile,
          permissions: formData.permissions,
          role: formData.role,
        };

        // If email changed, update Firestore (Auth email needs Firebase Console)
        if (formData.email !== editingAdmin.email) {
          updates.email = formData.email;
          toast.info('Email updated in database. For login email change, update in Firebase Console > Authentication.', { autoClose: 6000 });
        }

        await firestoreService.updateAdmin(editingAdmin.id, updates);
        toast.success('Admin updated successfully');
      } else {
        // Create new admin
        if (!formData.password || formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsSaving(false);
          return;
        }

        await createAdminUser(formData.email, formData.password, {
          name: formData.name,
          mobile: formData.mobile,
          role: formData.role,
          permissions: formData.permissions,
        });
        toast.success('Admin created successfully');
      }

      await loadAdmins();
      closeModal();
    } catch (error) {
      console.error('Failed to save admin:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered');
      } else {
        toast.error(error.message || 'Failed to save admin');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async (admin) => {
    setResetLoading(admin.id);
    try {
      await sendPasswordResetEmail(auth, admin.email);
      toast.success(`Password reset email sent to ${admin.email}`);
    } catch (error) {
      console.error('Failed to send reset email:', error);
      toast.error('Failed to send reset email');
    } finally {
      setResetLoading(null);
    }
  };

  const handleToggleActive = async (admin) => {
    try {
      await firestoreService.updateAdmin(admin.id, { isActive: !admin.isActive });
      toast.success(admin.isActive ? 'Admin deactivated' : 'Admin activated');
      await loadAdmins();
    } catch (error) {
      console.error('Failed to toggle active:', error);
      toast.error('Failed to update admin status');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'super_admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          <FiShield className="w-3 h-3" /> Super Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <FiUser className="w-3 h-3" /> Admin
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage admin accounts, permissions and access
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-500/20"
        >
          <FiPlus /> Add Admin
        </button>
      </div>

      {/* Admin List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-600" />
        </div>
      ) : admins.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FiUsers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No admins found</h3>
          <p className="text-sm text-gray-500 mb-5">Add your first admin to get started</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FiPlus /> Add Admin
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {admins.map((admin) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl border ${
                admin.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60'
              } shadow-sm p-5`}
            >
              {/* Top row: avatar, name, role badge */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 text-white font-semibold text-sm shrink-0">
                    {admin.avatar ? (
                      <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      (admin.name || '?').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{admin.name || 'Unnamed'}</div>
                    {getRoleBadge(admin.role)}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleActive(admin)}
                    className={`p-2 rounded-lg transition-colors ${
                      admin.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={admin.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                  >
                    {admin.isActive ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => openEditModal(admin)}
                    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{admin.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiPhone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>+91 {admin.mobile}</span>
                </div>
              </div>

              {/* Permissions */}
              {admin.role !== 'super_admin' && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-500 mb-1.5">Permissions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {admin.permissions && admin.permissions.length > 0 ? (
                      admin.permissions.map((perm) => (
                        <span key={perm} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 font-medium">
                          {PERMISSION_LABELS[perm] || perm}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No permissions assigned</span>
                    )}
                  </div>
                </div>
              )}
              {admin.role === 'super_admin' && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-500 mb-1.5">Permissions</div>
                  <span className="px-2 py-0.5 rounded-md text-xs bg-amber-50 text-amber-700 font-medium">Full Access</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleResetPassword(admin)}
                  disabled={resetLoading === admin.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
                >
                  {resetLoading === admin.id ? (
                    <AiOutlineLoading3Quarters className="animate-spin w-3 h-3" />
                  ) : (
                    <FiKey className="w-3 h-3" />
                  )}
                  Reset Password
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">
                  {editMode ? 'Edit Admin' : 'Create Admin'}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Rahul Sharma"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@example.com"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      required
                    />
                    {editMode && (
                      <p className="text-xs text-gray-400 mt-1">
                        Note: Login email changes require Firebase Console &gt; Authentication
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500">+91</span>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-r-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password (only for create) */}
                  {!editMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Minimum 6 characters"
                          minLength={6}
                          className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    >
                      <option value={ROLES.ADMIN}>Admin</option>
                      <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                    </select>
                  </div>

                  {/* Permissions (only for admin role) */}
                  {formData.role === 'admin' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Permissions
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={selectAllPermissions}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Select all
                          </button>
                          <span className="text-xs text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={clearAllPermissions}
                            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                        {ALL_PERMISSIONS.map((perm) => (
                          <label
                            key={perm}
                            className="flex items-center gap-3 cursor-pointer hover:bg-white px-2 py-1.5 rounded-md transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={(formData.permissions || []).includes(perm)}
                              onChange={() => togglePermission(perm)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{PERMISSION_LABELS[perm] || perm}</span>
                          </label>
                        ))}
                      </div>
                      {formData.role === 'admin' && formData.permissions.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1.5">
                          No permissions selected. This admin will only see the Dashboard.
                        </p>
                      )}
                    </div>
                  )}

                  {formData.role === 'super_admin' && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                        <FiShield className="w-4 h-4" />
                        Super Admin has full access to all features
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSaving}
                    className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <AiOutlineLoading3Quarters className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <FiSave /> {editMode ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManagement;
