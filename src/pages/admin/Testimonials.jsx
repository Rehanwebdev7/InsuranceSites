import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave, FiStar } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import * as firestoreService from '../../services/firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { invalidateCache } from '../../services/firebase/customerCache';

const emptyFeedback = {
  name: '',
  role: '',
  message: '',
  rating: 5,
  avatar: '',
  active: true,
  order: 0,
};

const AdminTestimonials = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyFeedback);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setIsLoading(true);
    try {
      if (db) {
        const data = await firestoreService.getCustomerFeedback();
        setList(data);
      } else {
        setList([]);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check Firestore security rules.');
      } else if (error.code === 'failed-precondition') {
        toast.error('Missing Firestore index. Check browser console for details.');
      } else {
        toast.error('Failed to load feedback');
      }
      setList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setFormData({
      ...emptyFeedback,
      order: list.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      role: item.role || '',
      message: item.message || '',
      rating: item.rating || 5,
      avatar: item.avatar || '',
      active: item.active !== undefined ? item.active : true,
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditingId(null);
    setFormData(emptyFeedback);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error('Name and message are required');
      return;
    }
    setIsSaving(true);
    try {
      if (editMode && editingId) {
        await firestoreService.updateCustomerFeedback(editingId, formData);
        toast.success('Feedback updated');
      } else {
        await firestoreService.addCustomerFeedback(formData);
        toast.success('Feedback added');
      }
      invalidateCache('customerFeedback');
      await loadFeedback();
      closeModal();
    } catch (error) {
      console.error('Failed to save feedback:', error);
      toast.error('Failed to save feedback');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await firestoreService.deleteCustomerFeedback(id);
      invalidateCache('customerFeedback');
      toast.success('Feedback deleted');
      await loadFeedback();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const toggleActive = async (item) => {
    try {
      await firestoreService.updateCustomerFeedback(item.id, { active: !item.active });
      invalidateCache('customerFeedback');
      await loadFeedback();
    } catch (error) {
      console.error('Failed to toggle active:', error);
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Feedback</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage testimonials shown on the home page
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-500/20"
        >
          <FiPlus /> Add feedback
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-600" />
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FiStar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No feedback yet</h3>
          <p className="text-sm text-gray-500 mb-5">
            Add your first customer testimonial to show on the website
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FiPlus /> Add feedback
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border ${
                item.active ? 'border-gray-200' : 'border-gray-200 opacity-60'
              } shadow-sm p-5 flex flex-col`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < (item.rating || 5) ? 'fill-current' : 'opacity-30'}
                    />
                  ))}
                </div>
                <button
                  onClick={() => toggleActive(item)}
                  className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${
                    item.active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  title={item.active ? 'Active — click to hide' : 'Hidden — click to show'}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      item.active ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed mb-4 line-clamp-4">
                &ldquo;{item.message}&rdquo;
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
                  {item.role && (
                    <div className="text-xs text-gray-500 truncate">{item.role}</div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
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
                  {editMode ? 'Edit feedback' : 'Add feedback'}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Priya Sharma"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role / Location
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Car owner, Mumbai"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="What did the customer say?"
                      rows={4}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} star{r > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar image URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://…"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Show on website</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-blue-600" />
                    </label>
                  </div>
                </div>
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
                        <AiOutlineLoading3Quarters className="animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <FiSave /> {editMode ? 'Update' : 'Add'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete feedback?</h3>
              <p className="text-sm text-gray-500 mb-5">
                This action cannot be undone. The testimonial will be removed from the website.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestimonials;
