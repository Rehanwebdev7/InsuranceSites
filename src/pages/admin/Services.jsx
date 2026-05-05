import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave, FiImage, FiUpload, FiLoader, FiCheck } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';
import * as firestoreService from '../../services/firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { uploadImage, getImageUrl, deleteImage } from '../../services/googleDrive';
import { getIllustrationSrc } from '../../data/illustrationGallery';
import defaultServices from '../../data/services.json';
import useAdminTheme from '../../hooks/useAdminTheme';

const ASPECT_RATIO = 1;

const getCroppedBlob = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        0.88
      );
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
};

const emptyService = {
  id: '',
  slug: '',
  title: '',
  description: '',
  icon: 'FaShieldAlt',
  illustrationKey: '',
  illustrationUrl: '',
  illustrationDriveId: '',
  color: '#C9A961',
  bgColor: '#FDFAF1',
  active: true,
  isVehicleInsurance: true,
  order: 0,
};

const resolveDisplaySrc = (s) =>
  s.illustrationUrl || (s.illustrationKey ? getIllustrationSrc(s.illustrationKey) : null);

const AdminServices = () => {
  const theme = useAdminTheme();
  const isLight = theme === 'light';

  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formData, setFormData] = useState(emptyService);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Track the previous Drive id when editing — used to delete the old file when admin
  // uploads a replacement (the firestore service also does this, but doing it here gives
  // immediate UX feedback).
  const [pendingDeleteDriveId, setPendingDeleteDriveId] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      if (db) {
        const services = await firestoreService.getServices();
        setServicesList(services.length > 0 ? services : defaultServices);
      } else {
        setServicesList(defaultServices);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error('Failed to load services');
      setServicesList(defaultServices);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingServiceId(null);
    setFormData({ ...emptyService, order: servicesList.length + 1 });
    setPendingDeleteDriveId('');
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditMode(true);
    setEditingServiceId(service.id);
    setFormData({ ...emptyService, ...service });
    setPendingDeleteDriveId('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditingServiceId(null);
    setFormData(emptyService);
    setPendingDeleteDriveId('');
  };

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Service title is required');
      return;
    }

    setIsSaving(true);
    const slug = formData.slug || generateSlug(formData.title);
    const serviceId = editingServiceId || formData.id;

    try {
      if (editMode && serviceId) {
        const { id: _id, ...rest } = formData;
        const updateData = { ...rest, slug };
        if (db) {
          await firestoreService.updateService(serviceId, updateData);
        }
        setServicesList((prev) =>
          prev.map((s) => (s.id === serviceId ? { ...s, ...updateData, id: serviceId } : s))
        );
        toast.success('Service updated');
      } else {
        const { id: _id, ...rest } = formData;
        const newServiceData = { ...rest, slug };
        if (db) {
          const result = await firestoreService.addService(newServiceData);
          setServicesList((prev) => [...prev, { ...newServiceData, id: result.id }]);
        } else {
          const id = formData.title.replace(/[^a-zA-Z0-9]/g, '').replace(/^./, (c) => c.toLowerCase());
          setServicesList((prev) => [...prev, { ...newServiceData, id: id || `service_${Date.now()}` }]);
        }
        toast.success('Service added');
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save service:', error);
      toast.error('Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      if (db) {
        await firestoreService.deleteService(id);
      }
    } catch (error) {
      console.error('Firestore delete error:', error);
    }
    setServicesList((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
    toast.success('Service deleted');
  };

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ---- Image flow ----
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please pick an image (PNG, JPG, SVG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(rawImage, croppedAreaPixels);
      const fileName = `service_${Date.now()}.jpg`;
      const fileId = await uploadImage(blob, fileName);
      const url = getImageUrl(fileId);

      // Capture old drive id so we can clean it up if the admin saves the form
      // (firestoreService.updateService also does this server-side, but we delete
      // immediately here so the Drive folder doesn't accumulate orphans during long
      // edit sessions).
      const previousDriveId = formData.illustrationDriveId || pendingDeleteDriveId;

      setFormData((prev) => ({
        ...prev,
        illustrationUrl: url,
        illustrationDriveId: fileId,
        illustrationKey: '', // clear legacy gallery key
      }));

      if (previousDriveId && previousDriveId !== fileId) {
        try { await deleteImage(previousDriveId); } catch (err) {
          console.warn('Failed to delete previous Drive image', err);
        }
      }
      setPendingDeleteDriveId('');
      toast.success('Image uploaded');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed: ' + (err.message || 'Please try again'));
    } finally {
      setUploading(false);
      setCropperOpen(false);
      setRawImage(null);
    }
  };

  const handleCloseCropper = () => {
    setCropperOpen(false);
    setRawImage(null);
  };

  const removeCurrentImage = () => {
    // Mark old drive id for cleanup on save
    if (formData.illustrationDriveId) {
      setPendingDeleteDriveId(formData.illustrationDriveId);
    }
    setFormData((prev) => ({
      ...prev,
      illustrationUrl: '',
      illustrationDriveId: '',
      illustrationKey: '',
    }));
  };

  const previewSrc = resolveDisplaySrc(formData);

  // ---- Theme tokens ----
  const t = isLight
    ? {
        pageHeading: 'text-noir-950',
        pageSub: 'text-ink-500',
        addBtn: 'bg-gradient-to-r from-[#C9A961] to-[#8B6F2C] text-noir-950 hover:from-[#D4AF37] hover:to-[#C9A961] border border-[#E5C770]',
        card: 'bg-white border border-[#EBDCB1]',
        cardTitle: 'text-noir-950',
        cardDesc: 'text-ink-600',
        actionIdle: 'text-ink-400',
        actionEdit: 'hover:text-[#8B6F2C] hover:bg-ivory-200',
        actionDel: 'hover:text-red-600 hover:bg-red-50',
        thumbBox: 'bg-ivory-100 border-[#EBDCB1]',
        statusActive: 'bg-[rgba(201,169,97,0.18)] text-[#8B6F2C] border border-[#C9A961]',
        statusInactive: 'bg-red-50 text-red-700 border border-red-200',
        modalBg: 'bg-white',
        modalDivider: 'border-[#EBDCB1]',
        modalHeading: 'text-noir-950',
        labelText: 'text-ink-700',
        input: 'bg-white text-noir-900 placeholder:text-ink-400 border-[#EBDCB1] focus:border-[#C9A961] focus:ring-[rgba(201,169,97,0.30)]',
        dropZone: 'border-[#EBDCB1] hover:border-[#C9A961] hover:bg-ivory-100',
        dropZoneText: 'text-ink-600',
        dropZoneSub: 'text-ink-400',
        toggleBg: 'bg-ivory-100',
        toggleSubText: 'text-ink-400',
        cancelBtn: 'bg-ivory-100 text-ink-700 hover:bg-ivory-200 border border-[#EBDCB1]',
        primaryBtn: 'bg-gradient-to-r from-[#C9A961] to-[#8B6F2C] text-noir-950 hover:from-[#D4AF37] hover:to-[#C9A961] border border-[#E5C770]',
        modalIconBtn: 'text-ink-500 hover:text-noir-900 hover:bg-ivory-100',
      }
    : {
        pageHeading: 'text-white',
        pageSub: 'text-ink-400',
        addBtn: 'bg-gradient-to-r from-[#C9A961] to-[#8B6F2C] text-noir-950 hover:from-[#D4AF37] hover:to-[#C9A961] border border-[#E5C770]',
        card: 'bg-noir-900 border border-[rgba(201,169,97,0.22)]',
        cardTitle: 'text-white',
        cardDesc: 'text-ink-300',
        actionIdle: 'text-ink-400',
        actionEdit: 'hover:text-[#E5C770] hover:bg-noir-800',
        actionDel: 'hover:text-red-300 hover:bg-red-500/15',
        thumbBox: 'bg-noir-800 border-[rgba(201,169,97,0.30)]',
        statusActive: 'bg-[rgba(201,169,97,0.15)] text-[#E5C770] border border-[rgba(201,169,97,0.40)]',
        statusInactive: 'bg-red-500/15 text-red-300 border border-red-500/30',
        modalBg: 'bg-noir-900',
        modalDivider: 'border-[rgba(201,169,97,0.22)]',
        modalHeading: 'text-white',
        labelText: 'text-ink-200',
        input: 'bg-noir-800 text-white placeholder:text-ink-500 border-[rgba(201,169,97,0.25)] focus:border-[#C9A961] focus:ring-[rgba(201,169,97,0.30)]',
        dropZone: 'border-[rgba(201,169,97,0.25)] hover:border-[#C9A961] hover:bg-noir-800',
        dropZoneText: 'text-ink-200',
        dropZoneSub: 'text-ink-400',
        toggleBg: 'bg-noir-800',
        toggleSubText: 'text-ink-400',
        cancelBtn: 'bg-noir-800 text-ink-200 hover:bg-noir-700 border border-[rgba(201,169,97,0.22)]',
        primaryBtn: 'bg-gradient-to-r from-[#C9A961] to-[#8B6F2C] text-noir-950 hover:from-[#D4AF37] hover:to-[#C9A961] border border-[#E5C770]',
        modalIconBtn: 'text-ink-300 hover:text-white hover:bg-noir-800',
      };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <AiOutlineLoading3Quarters className="animate-spin text-[#C9A961] text-3xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className={`text-2xl font-display font-bold tracking-tight ${t.pageHeading}`}>Services</h1>
          <p className={`${t.pageSub} text-sm`}>Manage your insurance services ({servicesList.length})</p>
        </div>
        <button
          onClick={openAddModal}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)] hover:shadow-[0_16px_32px_-12px_rgba(201,169,97,0.65)] ${t.addBtn}`}
        >
          <FiPlus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service, index) => {
          const cardSrc = resolveDisplaySrc(service);
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`rounded-xl shadow-sm p-6 relative ${t.card}`}
            >
              <div className="flex items-start justify-between mb-4">
                {cardSrc ? (
                  <div className={`w-16 h-16 rounded-xl overflow-hidden border flex items-center justify-center ${t.thumbBox}`}>
                    <img
                      src={cardSrc}
                      alt={service.title || 'Service'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-16 rounded-xl border flex items-center justify-center ${t.thumbBox}`}>
                    <FiImage className="w-6 h-6 text-[#C9A961]" />
                  </div>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(service)}
                    className={`p-2 rounded-lg transition-colors ${t.actionIdle} ${t.actionEdit}`}
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(service.id)}
                    className={`p-2 rounded-lg transition-colors ${t.actionIdle} ${t.actionDel}`}
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className={`text-lg font-display font-semibold tracking-tight mb-2 ${t.cardTitle}`}>
                {service.title || service.serviceName}
              </h3>
              {service.description && (
                <p className={`text-sm mb-4 line-clamp-2 ${t.cardDesc}`}>{service.description}</p>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${service.active ? t.statusActive : t.statusInactive}`}>
                  {service.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <AnimatePresence>
                {deleteConfirm === service.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 ${isLight ? 'bg-white/95' : 'bg-noir-900/95'}`}
                  >
                    <p className={`font-semibold mb-1 ${t.cardTitle}`}>Delete this service?</p>
                    <p className={`text-sm mb-4 text-center ${t.pageSub}`}>{service.title || service.serviceName}</p>
                    <p className={`text-[0.7rem] mb-4 italic ${t.pageSub}`}>
                      The Drive image (if any) will be removed too.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${t.cancelBtn}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {servicesList.length === 0 && (
        <div className={`text-center py-12 rounded-xl ${t.card} ${t.pageSub}`}>
          <p className="mb-2">No services yet</p>
          <button onClick={openAddModal} className="text-[#C9A961] hover:underline text-sm font-semibold">
            Add your first service
          </button>
        </div>
      )}

      {/* ===================================================================
           Add / Edit modal — image upload only
         =================================================================== */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`rounded-2xl shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] w-full max-w-2xl my-8 ${t.modalBg} border ${t.modalDivider}`}
            >
              <div className={`flex items-center justify-between p-6 border-b ${t.modalDivider}`}>
                <div>
                  <span className="font-display italic text-[0.6rem] font-semibold text-[#C9A961] tracking-widest">Nº 03</span>
                  <h2 className={`text-xl font-display font-bold tracking-tight ${t.modalHeading}`}>
                    {editMode ? 'Edit service' : 'New service'}
                  </h2>
                </div>
                <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${t.modalIconBtn}`}>
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image area */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${t.labelText}`}>Service image</label>
                  {previewSrc ? (
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-[rgba(201,169,97,0.30)]">
                      <div className={`w-24 h-24 rounded-lg overflow-hidden border ${t.thumbBox}`}>
                        <img
                          src={previewSrc}
                          alt="Service"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${t.pageSub} mb-1`}>
                          {formData.illustrationDriveId
                            ? 'Custom image (Google Drive)'
                            : formData.illustrationKey
                              ? 'Legacy gallery illustration'
                              : 'Image attached'}
                        </p>
                        <p className={`text-xs truncate ${t.cardDesc}`}>{formData.illustrationUrl || formData.illustrationKey}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${t.cancelBtn}`}>
                            <FiUpload className="w-3.5 h-3.5" /> Replace
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={removeCurrentImage}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${t.dropZone}`}>
                      <FiImage className="w-8 h-8 text-[#C9A961]" />
                      <span className={`text-sm font-semibold ${t.dropZoneText}`}>Click to upload image</span>
                      <span className={`text-xs ${t.dropZoneSub}`}>PNG, JPG, SVG, WebP · 1:1 crop · stored on Google Drive</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${t.labelText}`}>Title <span className="text-[#C9A961]">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${t.input}`}
                    placeholder="e.g. Two-Wheeler Insurance"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${t.labelText}`}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none resize-none transition-colors ${t.input}`}
                    placeholder="Brief description of the service"
                  />
                </div>

                {/* Vehicle Insurance */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${t.toggleBg}`}>
                  <div>
                    <span className={`text-sm font-medium ${t.labelText}`}>Vehicle insurance?</span>
                    <p className={`text-xs mt-0.5 ${t.toggleSubText}`}>If on, quote form asks for vehicle number and model</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVehicleInsurance !== false}
                      onChange={(e) => updateFormField('isVehicleInsurance', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-noir-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-[#C9A961]" />
                  </label>
                </div>

                {/* Active */}
                <div>
                  <label className={`flex items-center gap-2 cursor-pointer ${t.labelText}`}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => updateFormField('active', e.target.checked)}
                      className="w-4 h-4 accent-[#C9A961]"
                    />
                    <span className="text-sm">Active (visible on site)</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${t.cancelBtn}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold disabled:opacity-70 shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)] hover:shadow-[0_16px_32px_-12px_rgba(201,169,97,0.65)] ${t.primaryBtn}`}
                  >
                    {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {editMode ? 'Update service' : 'Add service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================
           Cropper modal (1:1)
         =================================================================== */}
      <AnimatePresence>
        {cropperOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-2xl w-full max-w-2xl ${t.modalBg} border ${t.modalDivider} shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] overflow-hidden`}
            >
              <div className={`flex items-center justify-between px-6 py-4 border-b ${t.modalDivider}`}>
                <div>
                  <span className="font-display italic text-[0.6rem] font-semibold text-[#C9A961] tracking-widest">Crop · 1:1</span>
                  <h3 className={`font-display font-bold ${t.modalHeading}`}>Frame your image</h3>
                </div>
                <button onClick={handleCloseCropper} className={`p-2 rounded-lg transition-colors ${t.modalIconBtn}`}>
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="relative w-full bg-black" style={{ height: 400 }}>
                <Cropper
                  image={rawImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={ASPECT_RATIO}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className={`px-6 py-4 border-t ${t.modalDivider}`}>
                <label className={`block text-xs font-semibold mb-2 ${t.labelText}`}>Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#C9A961]"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseCropper}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${t.cancelBtn}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCrop}
                    disabled={uploading}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-70 ${t.primaryBtn}`}
                  >
                    {uploading ? (
                      <>
                        <FiLoader className="animate-spin" /> Uploading…
                      </>
                    ) : (
                      <>
                        <FiCheck /> Save crop
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;
