import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave, FiImage, FiUpload, FiGrid, FiZap, FiCheck, FiLoader } from 'react-icons/fi';
import {
  FaMotorcycle, FaCar, FaCarSide, FaCarCrash, FaTruck, FaTruckMoving,
  FaBus, FaBusAlt, FaTractor, FaShieldAlt, FaFileAlt, FaFileContract,
  FaFileSignature, FaSyncAlt, FaHeart, FaHeartbeat, FaHome, FaUmbrella,
  FaPlane, FaShip, FaAmbulance, FaBriefcaseMedical, FaStethoscope,
  FaFirstAid, FaBaby, FaDog, FaPaw, FaBuilding, FaBriefcase,
  FaFire, FaHandHoldingHeart, FaHandHoldingMedical, FaHandshake,
  FaUserShield, FaUsers, FaLeaf, FaSeedling, FaMoneyBillWave,
  FaWheelchair, FaHospital, FaClinicMedical, FaPills,
  FaCaravan, FaSuitcaseRolling, FaGlobeAsia, FaHorse,
} from 'react-icons/fa';
import { GiCow, GiBull, GiChargingBull, GiBuffaloHead, GiGoat, GiSheep } from 'react-icons/gi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import * as firestoreService from '../../services/firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { uploadImage, getImageUrl } from '../../services/googleDrive';
import { ILLUSTRATION_GALLERY, getIllustrationSrc } from '../../data/illustrationGallery';
import defaultServices from '../../data/services.json';

const iconMap = {
  FaMotorcycle, FaCar, FaCarSide, FaCarCrash, FaTruck, FaTruckMoving,
  FaBus, FaBusAlt, FaTractor, FaShieldAlt, FaFileAlt, FaFileContract,
  FaFileSignature, FaSyncAlt, FaHeart, FaHeartbeat, FaHome, FaUmbrella,
  FaPlane, FaShip, FaAmbulance, FaBriefcaseMedical, FaStethoscope,
  FaFirstAid, FaBaby, FaDog, FaPaw, FaBuilding, FaBriefcase,
  FaFire, FaHandHoldingHeart, FaHandHoldingMedical, FaHandshake,
  FaUserShield, FaUsers, FaLeaf, FaSeedling, FaMoneyBillWave,
  FaWheelchair, FaHospital, FaClinicMedical, FaPills,
  FaCaravan, FaSuitcaseRolling, FaGlobeAsia, FaHorse,
  GiCow, GiBull, GiChargingBull, GiBuffaloHead, GiGoat, GiSheep,
};

const ICON_OPTIONS = [
  { value: '', label: '── Vehicle ──', disabled: true },
  { value: 'FaMotorcycle', label: 'Motorcycle / Two Wheeler' },
  { value: 'FaCar', label: 'Car / Four Wheeler' },
  { value: 'FaCarSide', label: 'Car (Side View)' },
  { value: 'FaCarCrash', label: 'Car Accident' },
  { value: 'FaTruck', label: 'Truck' },
  { value: 'FaTruckMoving', label: 'Truck (Moving)' },
  { value: 'FaBus', label: 'Bus' },
  { value: 'FaBusAlt', label: 'School Bus' },
  { value: 'FaTractor', label: 'Tractor' },
  { value: 'FaCaravan', label: 'Caravan' },
  { value: 'FaShip', label: 'Ship / Marine' },
  { value: 'FaPlane', label: 'Travel / Plane' },
  { value: '', label: '── Health & Life ──', disabled: true },
  { value: 'FaHeartbeat', label: 'Health Insurance' },
  { value: 'FaStethoscope', label: 'Medical' },
  { value: 'FaHospital', label: 'Hospital' },
  { value: 'FaClinicMedical', label: 'Clinic' },
  { value: 'FaAmbulance', label: 'Ambulance' },
  { value: 'FaBriefcaseMedical', label: 'Medical Kit' },
  { value: 'FaFirstAid', label: 'First Aid' },
  { value: 'FaPills', label: 'Medicine' },
  { value: 'FaWheelchair', label: 'Disability' },
  { value: 'FaBaby', label: 'Child / Maternity' },
  { value: 'FaUserShield', label: 'Life Insurance' },
  { value: 'FaUsers', label: 'Family / Group' },
  { value: 'FaHandHoldingHeart', label: 'Care / Support' },
  { value: 'FaHandHoldingMedical', label: 'Health Support' },
  { value: '', label: '── Property & Business ──', disabled: true },
  { value: 'FaHome', label: 'Home / Property' },
  { value: 'FaBuilding', label: 'Commercial Property' },
  { value: 'FaBriefcase', label: 'Business' },
  { value: 'FaFire', label: 'Fire Insurance' },
  { value: 'FaHandshake', label: 'Partnership / Liability' },
  { value: 'FaMoneyBillWave', label: 'Financial' },
  { value: '', label: '── Agriculture & Pets ──', disabled: true },
  { value: 'FaDog', label: 'Pet Insurance' },
  { value: 'FaPaw', label: 'Cattle / Animal' },
  { value: 'GiCow', label: 'Cow' },
  { value: 'GiBull', label: 'Bull' },
  { value: 'GiChargingBull', label: 'Charging Bull' },
  { value: 'GiBuffaloHead', label: 'Buffalo' },
  { value: 'GiGoat', label: 'Goat' },
  { value: 'GiSheep', label: 'Sheep' },
  { value: 'FaHorse', label: 'Horse / Livestock' },
  { value: 'FaLeaf', label: 'Crop Insurance' },
  { value: 'FaSeedling', label: 'Agriculture' },
  { value: '', label: '── General ──', disabled: true },
  { value: 'FaShieldAlt', label: 'Shield / Protection' },
  { value: 'FaUmbrella', label: 'Umbrella / Coverage' },
  { value: 'FaHeart', label: 'Heart' },
  { value: 'FaFileAlt', label: 'Document' },
  { value: 'FaFileContract', label: 'Contract' },
  { value: 'FaFileSignature', label: 'Signature / Agreement' },
  { value: 'FaSyncAlt', label: 'Renewal' },
  { value: 'FaSuitcaseRolling', label: 'Travel Luggage' },
  { value: 'FaGlobeAsia', label: 'International' },
];


const emptyService = {
  id: '',
  slug: '',
  title: '',
  description: '',
  icon: 'FaShieldAlt',
  illustrationKey: '',
  illustrationUrl: '',
  color: '#C9A961',
  bgColor: '#FDFAF1',
  active: true,
  isVehicleInsurance: true,
  order: 0,
};

/**
 * Returns the image src to render for a service card preview, in the same priority
 * order as ServiceCard.jsx: illustrationUrl → illustrationKey → null (icon fallback).
 */
const resolveIllustrationSrc = (form) =>
  form.illustrationUrl || (form.illustrationKey ? getIllustrationSrc(form.illustrationKey) : null);

const AdminServices = () => {
  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formData, setFormData] = useState(emptyService);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  // Illustration picker tab: 'gallery' | 'upload' | 'icon'
  const [illTab, setIllTab] = useState('gallery');
  const [uploadingIll, setUploadingIll] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      if (db) {
        const services = await firestoreService.getServices();
        if (services.length > 0) {
          setServicesList(services);
        } else {
          setServicesList(defaultServices);
        }
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

  const decideInitialTab = (service) => {
    if (service?.illustrationUrl) return 'upload';
    if (service?.illustrationKey) return 'gallery';
    return 'gallery';
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingServiceId(null);
    setFormData({
      ...emptyService,
      order: servicesList.length + 1,
    });
    setIllTab('gallery');
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditMode(true);
    setEditingServiceId(service.id);
    setFormData({ ...emptyService, ...service });
    setIllTab(decideInitialTab(service));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditingServiceId(null);
    setFormData(emptyService);
    setIllTab('gallery');
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

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
        const { id: _id, ...restFormData } = formData;
        const updateData = { ...restFormData, slug };
        if (db) {
          await firestoreService.updateService(serviceId, updateData);
        }
        setServicesList((prev) =>
          prev.map((s) => (s.id === serviceId ? { ...s, ...updateData, id: serviceId } : s))
        );
        toast.success('Service updated successfully');
      } else {
        const { id: _id, ...restFormData } = formData;
        const newServiceData = { ...restFormData, slug };
        if (db) {
          const result = await firestoreService.addService(newServiceData);
          setServicesList((prev) => [...prev, { ...newServiceData, id: result.id }]);
        } else {
          const id = formData.title.replace(/[^a-zA-Z0-9]/g, '').replace(/^./, (c) => c.toLowerCase());
          setServicesList((prev) => [...prev, { ...newServiceData, id: id || `service_${Date.now()}` }]);
        }
        toast.success('Service added successfully');
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

  // When admin picks a gallery item, store the key and clear any uploaded URL
  const pickGallery = (key) => {
    setFormData((prev) => ({ ...prev, illustrationKey: key, illustrationUrl: '' }));
  };

  // When admin uploads a file, push to Drive then store URL + clear gallery key
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please pick an image (PNG, SVG, or JPG).');
      return;
    }
    setUploadingIll(true);
    try {
      const fileName = `service_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const fileId = await uploadImage(file, fileName);
      const url = getImageUrl(fileId);
      setFormData((prev) => ({ ...prev, illustrationUrl: url, illustrationKey: '' }));
      toast.success('Illustration uploaded');
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Upload failed: ' + (err.message || 'Please try again'));
    } finally {
      setUploadingIll(false);
      e.target.value = '';
    }
  };

  const clearIllustration = () => {
    setFormData((prev) => ({ ...prev, illustrationKey: '', illustrationUrl: '' }));
  };

  const previewSrc = resolveIllustrationSrc(formData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-500">Manage your insurance services ({servicesList.length})</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service, index) => {
          const cardSrc =
            service.illustrationUrl ||
            (service.illustrationKey ? getIllustrationSrc(service.illustrationKey) : null);
          const Icon = iconMap[service.icon] || FaShieldAlt;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-6 relative"
            >
              <div className="flex items-start justify-between mb-4">
                {cardSrc ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#FDFAF1] border border-[#EBDCB1] flex items-center justify-center">
                    <img
                      src={cardSrc}
                      alt={service.title || 'Service'}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: service.bgColor || '#FDFAF1', color: service.color || '#8B6F2C' }}
                  >
                    <Icon className="text-2xl" />
                  </div>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(service.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title || service.serviceName}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    service.active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {service.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <AnimatePresence>
                {deleteConfirm === service.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6"
                  >
                    <p className="text-gray-800 font-medium mb-1">Delete this service?</p>
                    <p className="text-gray-500 text-sm mb-4 text-center">{service.title || service.serviceName}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
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
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
          <p className="mb-2">No services yet</p>
          <button onClick={openAddModal} className="text-blue-600 hover:underline text-sm">
            Add your first service
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {editMode ? 'Edit Service' : 'Add Service'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g. Two-Wheeler Insurance"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Brief description of the service"
                  />
                </div>

                {/* Illustration picker — tabbed */}
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                  <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-2 py-1.5">
                    {[
                      { id: 'gallery', label: 'Pick from gallery', icon: FiGrid },
                      { id: 'upload', label: 'Upload custom', icon: FiUpload },
                      { id: 'icon', label: 'Icon (legacy)', icon: FiZap },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = illTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setIllTab(tab.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isActive
                              ? 'bg-[#FDFAF1] text-[#5C4A1D] border border-[#EBDCB1]'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                      );
                    })}
                    <div className="ml-auto flex items-center gap-2 pr-1">
                      {previewSrc ? (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-9 h-9 rounded-lg overflow-hidden bg-[#FDFAF1] border border-[#EBDCB1] flex items-center justify-center">
                            <img src={previewSrc} alt="Preview" className="w-full h-full object-contain p-0.5" />
                          </span>
                          <button
                            type="button"
                            onClick={clearIllustration}
                            className="text-red-500 hover:text-red-700 underline"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No illustration · icon fallback</span>
                      )}
                    </div>
                  </div>

                  {/* Tab body */}
                  <div className="p-4">
                    {illTab === 'gallery' && (
                      <div>
                        <p className="text-xs text-gray-500 mb-3">
                          Pick a bundled illustration. Free, ready to use, no upload needed.
                        </p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                          {ILLUSTRATION_GALLERY.map((g) => {
                            const isPicked = formData.illustrationKey === g.key && !formData.illustrationUrl;
                            return (
                              <button
                                key={g.key}
                                type="button"
                                onClick={() => pickGallery(g.key)}
                                title={g.label}
                                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all bg-white hover:scale-105 ${
                                  isPicked
                                    ? 'border-[#C9A961] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.5)]'
                                    : 'border-gray-200 hover:border-[#EBDCB1]'
                                }`}
                              >
                                <img
                                  src={`/illustrations/${g.key}.svg`}
                                  alt={g.label}
                                  className="w-full h-full object-contain p-1.5"
                                  loading="lazy"
                                />
                                {isPicked && (
                                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#C9A961] text-white flex items-center justify-center shadow">
                                    <FiCheck className="w-3 h-3" strokeWidth={3} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {illTab === 'upload' && (
                      <div>
                        <div className="mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs font-semibold text-amber-900 mb-1.5">
                            ✦ Where to find professional GIFs / illustrations:
                          </p>
                          <ul className="text-[0.7rem] text-amber-800 space-y-0.5">
                            <li>
                              <strong>storyset.com</strong> — flat illustrations, customize colors, export as GIF / Lottie / SVG / PNG (recommended)
                            </li>
                            <li>
                              <strong>lottiefiles.com</strong> — animated Lottie files (convert to GIF via lottiefiles.com/converter)
                            </li>
                            <li>
                              <strong>icons8.com</strong> — animated icons (transport, insurance, finance)
                            </li>
                            <li>
                              <strong>giphy.com</strong> — quick GIF search by category
                            </li>
                          </ul>
                          <p className="text-[0.7rem] text-amber-700 mt-2 italic">
                            Tip: download with <strong>transparent background</strong>. The cream oval on the customer site provides the background — your GIF/PNG just needs to be the subject.
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Upload a custom PNG, SVG, GIF, or JPG. Stored in Google Drive via the existing pipeline.
                        </p>
                        {formData.illustrationUrl ? (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
                            <img
                              src={formData.illustrationUrl}
                              alt="Custom illustration"
                              className="w-16 h-16 object-contain rounded border border-gray-200 bg-[#FDFAF1] p-1"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 mb-1">Custom illustration</p>
                              <p className="text-xs text-gray-700 truncate">{formData.illustrationUrl}</p>
                            </div>
                            <button
                              type="button"
                              onClick={clearIllustration}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label
                            className={`flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                              uploadingIll
                                ? 'border-[#C9A961] bg-[#FDFAF1] cursor-wait'
                                : 'border-gray-300 hover:border-[#C9A961] hover:bg-[#FDFAF1]'
                            }`}
                          >
                            {uploadingIll ? (
                              <>
                                <FiLoader className="w-6 h-6 text-[#8B6F2C] animate-spin" />
                                <span className="text-sm font-medium text-gray-700">Uploading…</span>
                              </>
                            ) : (
                              <>
                                <FiImage className="w-6 h-6 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Click to upload</span>
                                <span className="text-xs text-gray-500">PNG, GIF, SVG, JPG, or WebP · up to 2 MB</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/webp"
                              onChange={handleUpload}
                              disabled={uploadingIll}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    )}

                    {illTab === 'icon' && (
                      <div>
                        <p className="text-xs text-gray-500 mb-3">
                          Legacy icon picker. Used as fallback when no illustration is set.
                        </p>
                        <select
                          value={formData.icon}
                          onChange={(e) => updateFormField('icon', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent outline-none"
                        >
                          {ICON_OPTIONS.map((opt, idx) =>
                            opt.disabled ? (
                              <option key={`group-${idx}`} disabled value="">
                                {opt.label}
                              </option>
                            ) : (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand color (icon fallback only)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => {
                        updateFormField('color', e.target.value);
                        updateFormField('bgColor', e.target.value + '15');
                      }}
                      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                    />
                    <span className="text-sm text-gray-500 uppercase">{formData.color}</span>
                    {!previewSrc && formData.icon && iconMap[formData.icon] && (() => {
                      const PreviewIcon = iconMap[formData.icon];
                      return (
                        <div
                          className="ml-auto w-12 h-12 rounded-xl flex items-center justify-center border"
                          style={{ backgroundColor: formData.color + '15', borderColor: formData.color + '30' }}
                        >
                          <PreviewIcon className="text-2xl" style={{ color: formData.color }} />
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Vehicle Insurance Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Vehicle Insurance?</span>
                    <p className="text-xs text-gray-400 mt-0.5">If ON, quote form will ask for vehicle number and model</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVehicleInsurance !== false}
                      onChange={(e) => updateFormField('isVehicleInsurance', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-[#C9A961]" />
                  </label>
                </div>

                {/* Active Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => updateFormField('active', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70"
                  >
                    {isSaving ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    {editMode ? 'Update' : 'Add Service'}
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

export default AdminServices;
