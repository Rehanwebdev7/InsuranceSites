import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { prefetchCustomerData } from '../services/firebase/customerCache';
import defaultServices from '../data/services.json';

const CustomerDataContext = createContext(null);

export const CustomerDataProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const result = await prefetchCustomerData();

        if (cancelled) return;

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
        if (cancelled) return;
        console.error('Failed to prefetch customer data:', error);
        setServices(defaultServices);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

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
