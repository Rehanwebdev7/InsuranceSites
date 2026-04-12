import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave } from 'react-icons/fi';
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
  color: '#2563eb',
  bgColor: '#eff6ff',
  active: true,
  isVehicleInsurance: true,
  order: 0,
};

const AdminServices = () => {
  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formData, setFormData] = useState(emptyService);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load services from Firestore on mount
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
          // No services in Firestore — use local defaults
          setServicesList(defaultServices);
        }
      } else {
        // No Firebase — use local defaults
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
    setFormData({
      ...emptyService,
      order: servicesList.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditMode(true);
    setEditingServiceId(service.id);
    setFormData({ ...service });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditingServiceId(null);
    setFormData(emptyService);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

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
        // Update existing service in Firestore
        const { id: _id, ...restFormData } = formData;
        const updateData = { ...restFormData, slug };
        if (db) {
          await firestoreService.updateService(serviceId, updateData);
        }
        setServicesList((prev) =>
          prev.map((s) =>
            s.id === serviceId ? { ...s, ...updateData, id: serviceId } : s
          )
        );
        toast.success('Service updated successfully');
      } else {
        // Add new service to Firestore
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
    // Always update local state and close confirm
    setServicesList((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
    toast.success('Service deleted');
  };

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        {servicesList.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-6 relative"
          >
            <div className="flex items-start justify-between mb-4">
              {(() => {
                const Icon = iconMap[service.icon] || FaShieldAlt;
                return (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: service.bgColor || '#eff6ff', color: service.color || '#2563eb' }}
                  >
                    <Icon className="text-2xl" />
                  </div>
                );
              })()}
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

            {/* Delete Confirmation */}
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
        ))}
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
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8"
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

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => updateFormField('icon', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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

                {/* Color + Icon Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
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
                    {/* Icon Preview */}
                    {formData.icon && iconMap[formData.icon] && (() => {
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
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-blue-600" />
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
