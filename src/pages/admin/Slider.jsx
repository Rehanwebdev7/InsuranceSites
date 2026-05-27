import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiX, FiCheck, FiImage, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';
import { uploadImage, deleteImage, getImageUrl } from '../../services/googleDrive';
import {
  addSliderImage,
  getSliderImages,
  updateSliderImage,
  deleteSliderImage,
} from '../../services/firebase/firestore';

// Matches the customer HeroSlider aspect ratio (lg:aspect-[16/9]) so the
// admin sees exactly what the visitor sees. The mobile view (16/10) gets a
// minor side-crop via object-cover — acceptable since 16/9 is the dominant
// desktop layout.
const ASPECT_RATIO = 16 / 9;

// Cap output width so big DSLR uploads don't bloat Firestore / Drive.
// 1600px is more than enough for a hero slider on any retina display.
const MAX_OUTPUT_WIDTH = 1600;

const getCroppedBlob = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      // Compute output dimensions — downscale if the crop is wider than cap.
      const scale = pixelCrop.width > MAX_OUTPUT_WIDTH
        ? MAX_OUTPUT_WIDTH / pixelCrop.width
        : 1;
      const outW = Math.round(pixelCrop.width * scale);
      const outH = Math.round(pixelCrop.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      // Better downscale quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outW,
        outH
      );
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        0.82
      );
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
};

const AdminSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Load slides on mount — no Drive auth needed anymore
  useEffect(() => {
    const init = async () => {
      try {
        const data = await getSliderImages();
        setSlides(data);
      } catch (err) {
        console.error('Failed to load slider images:', err);
        toast.error('Failed to load slides');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
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

  // Upload via Cloud Function (service account — no OAuth needed)
  const handleSaveCrop = async () => {
    if (!rawImage || !croppedAreaPixels) return;

    setUploading(true);
    try {
      const blob = await getCroppedBlob(rawImage, croppedAreaPixels);
      const fileName = `slider_${Date.now()}.jpg`;
      const fileId = await uploadImage(blob, fileName);
      const imageUrl = getImageUrl(fileId);
      const newSlide = await addSliderImage({
        title: `Slide ${slides.length + 1}`,
        headline: '',
        subHeadline: '',
        imageUrl,
        driveFileId: fileId,
        order: slides.length,
        active: true,
      });

      setSlides((prev) => [...prev, newSlide]);
      toast.success('Slide uploaded successfully');
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

  // Delete via Cloud Function
  const handleDelete = async (slide) => {
    setDeleting(slide.id);
    try {
      if (slide.driveFileId) {
        await deleteImage(slide.driveFileId);
      }
      await deleteSliderImage(slide.id);
      setSlides((prev) => prev.filter((s) => s.id !== slide.id));
      toast.success('Slide deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Delete failed: ' + (err.message || 'Please try again'));
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const handleToggleActive = async (slideId, currentActive) => {
    const newActive = !currentActive;
    setSlides((prev) =>
      prev.map((s) => (s.id === slideId ? { ...s, active: newActive } : s))
    );
    try {
      await updateSliderImage(slideId, { active: newActive });
      toast.success(newActive ? 'Slide activated' : 'Slide deactivated');
    } catch (err) {
      setSlides((prev) =>
        prev.map((s) => (s.id === slideId ? { ...s, active: currentActive } : s))
      );
      toast.error('Failed to update slide status');
    }
  };

  const handleFieldChange = (slideId, field, value) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === slideId ? { ...s, [field]: value } : s))
    );
  };

  const handleFieldBlur = (slideId, field, value) => {
    updateSliderImage(slideId, { [field]: value }).catch((err) =>
      console.error(`${field} update failed:`, err)
    );
  };

  const handleOrderChange = (slideId, order) => {
    setSlides((prev) =>
      prev
        .map((slide) => (slide.id === slideId ? { ...slide, order } : slide))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    );
  };

  const handleOrderBlur = async (slideId, order) => {
    try {
      await updateSliderImage(slideId, { order });
    } catch (err) {
      console.error('Order update failed:', err);
      toast.error('Failed to update slide order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const activeCount = slides.filter((s) => s.active !== false).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Slider Management</h1>
          <p className="text-gray-500">
            Manage homepage slider images ({activeCount} active / {slides.length} total)
          </p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm bg-blue-600 text-white hover:bg-blue-700">
          <FiPlus className="w-4 h-4" /> Add Slide
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => {
          const isActive = slide.active !== false;
          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl shadow-sm overflow-hidden relative group ${!isActive ? 'opacity-60' : ''}`}
            >
              <div className="relative aspect-[16/9] bg-gray-100">
                {slide.imageUrl ? (
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FiImage className="w-16 h-16" />
                  </div>
                )}

                {!isActive && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-black/60 text-white rounded-lg text-sm font-medium">Inactive</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(slide.id, isActive)}
                    className={`w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center text-white transition-opacity ${
                      isActive ? 'bg-green-500/80 hover:bg-green-600' : 'bg-gray-500/80 hover:bg-gray-600'
                    }`}
                    title={isActive ? 'Deactivate slide' : 'Activate slide'}
                  >
                    {isActive ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(slide.id)}
                    className="w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Delete slide"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                <div className="grid grid-cols-[minmax(0,1fr),96px] gap-3">
                  <input
                    type="text"
                    value={slide.title || ''}
                    onChange={(e) => handleFieldChange(slide.id, 'title', e.target.value)}
                    onBlur={(e) => handleFieldBlur(slide.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Internal label (admin only)"
                  />
                  <input
                    type="number"
                    min="0"
                    value={slide.order ?? index}
                    onChange={(e) => handleOrderChange(slide.id, Number(e.target.value))}
                    onBlur={(e) => handleOrderBlur(slide.id, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Order"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Headline <span className="text-gray-400 font-normal normal-case">(big text on the website hero)</span>
                  </label>
                  <input
                    type="text"
                    value={slide.headline || ''}
                    onChange={(e) => handleFieldChange(slide.id, 'headline', e.target.value)}
                    onBlur={(e) => handleFieldBlur(slide.id, 'headline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder='e.g. "Insurance, delivered like | luxury."'
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Description <span className="text-gray-400 font-normal normal-case">(sub-text below headline)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={slide.subHeadline || ''}
                    onChange={(e) => handleFieldChange(slide.id, 'subHeadline', e.target.value)}
                    onBlur={(e) => handleFieldBlur(slide.id, 'subHeadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder='Short subtitle for this slide. Leave blank to use the site default.'
                  />
                </div>
              </div>

              <AnimatePresence>
                {deleteConfirm === slide.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10"
                  >
                    <p className="text-white font-medium mb-4">Delete this slide?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                        disabled={deleting === slide.id}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(slide)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                        disabled={deleting === slide.id}
                      >
                        {deleting === slide.id && <FiLoader className="w-3 h-3 animate-spin" />}
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

      {slides.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <FiImage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">No slider images yet</p>
          <p className="text-gray-400 text-sm mb-6">Upload images to create an image slider on your homepage</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <FiPlus className="w-4 h-4" /> Upload First Image
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> Each slide controls its own <em>headline</em> and <em>description</em> on the homepage hero — leave them blank to fall back to the site default. Use <code>|</code> inside the headline to pick the accent word (e.g. <em>"Insurance, delivered like | luxury."</em> — the part after <code>|</code> gets the script gold treatment). Images are auto-cropped to 16:9 and compressed before upload so the slider always looks crisp. Toggle <FiEye className="inline w-4 h-4" />/<FiEyeOff className="inline w-4 h-4" /> to show/hide without deleting; use the order field to control sequence.
        </p>
      </div>

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {cropperOpen && rawImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-sm">
              <h3 className="text-white font-semibold text-lg">Crop Image</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseCropper}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                  disabled={uploading}
                >
                  <FiX className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  disabled={uploading}
                >
                  {uploading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Save & Upload'}
                </button>
              </div>
            </div>

            <div className="relative flex-1">
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

            <div className="flex items-center justify-center gap-4 px-6 py-4 bg-black/50 backdrop-blur-sm">
              <span className="text-white text-sm">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-48 accent-blue-500"
              />
              <span className="text-white text-sm w-10">{zoom.toFixed(1)}x</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSlider;
