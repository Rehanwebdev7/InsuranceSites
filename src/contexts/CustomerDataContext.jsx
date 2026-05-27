import { createContext, useCallback, useContext, useState, useEffect, useMemo } from 'react';
import { prefetchCustomerData, invalidateCache } from '../services/firebase/customerCache';
import defaultServices from '../data/services.json';

const CustomerDataContext = createContext(null);

export const CustomerDataProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const result = await prefetchCustomerData();

      setServices(result.services.length > 0 ? result.services : defaultServices);
      setSliderImages(result.sliderImages);
      setCustomerFeedback(result.customerFeedback || []);

      if (result.errors.services) {
        console.error('Failed to load services:', result.errors.services);
      }
      if (result.errors.sliderImages) {
        console.error('Failed to load slider images:', result.errors.sliderImages);
      }
      if (result.errors.customerFeedback) {
        console.error('Failed to load customer feedback:', result.errors.customerFeedback);
      }
    } catch (error) {
      console.error('Failed to prefetch customer data:', error);
      setServices(defaultServices);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadData();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [loadData]);

  // Listen for admin updates so the public site picks them up without a reload.
  // Two channels:
  //   - same tab : `CustomEvent` dispatched on window
  //   - other tab: `storage` event when admin writes to localStorage on save
  // Both call the same refresh path.
  useEffect(() => {
    const refresh = async (key) => {
      try { invalidateCache(key); } catch (err) { /* defensive */ }
      await loadData();
    };
    const onServices = () => refresh('services');
    const onSlider = () => refresh('sliderImages');
    const onFeedback = () => refresh('customerFeedback');
    const onStorage = (e) => {
      if (!e || !e.key) return;
      if (e.key === 'bharat:services-updated') refresh('services');
      else if (e.key === 'bharat:slider-updated') refresh('sliderImages');
      else if (e.key === 'bharat:feedback-updated') refresh('customerFeedback');
    };
    window.addEventListener('services-updated', onServices);
    window.addEventListener('slider-updated', onSlider);
    window.addEventListener('feedback-updated', onFeedback);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('services-updated', onServices);
      window.removeEventListener('slider-updated', onSlider);
      window.removeEventListener('feedback-updated', onFeedback);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadData]);

  const value = useMemo(
    () => ({ services, sliderImages, customerFeedback, isLoading }),
    [services, sliderImages, customerFeedback, isLoading]
  );

  return (
    <CustomerDataContext.Provider value={value}>
      {children}
    </CustomerDataContext.Provider>
  );
};

export const useCustomerData = () => {
  const context = useContext(CustomerDataContext);
  if (!context) {
    throw new Error('useCustomerData must be used within a CustomerDataProvider');
  }
  return context;
};
