/**
 * In-memory cache for customer-facing data.
 * Clears automatically on page refresh (module re-initialization).
 * Deduplicates concurrent requests to the same resource.
 */
import * as firestoreService from './firestore';
import { db } from './firebase';

const cache = {
  services: { data: null, promise: null },
  sliderImages: { data: null, promise: null },
  customerFeedback: { data: null, promise: null },
};

export const getCachedServices = () => {
  if (cache.services.data) return Promise.resolve(cache.services.data);
  if (cache.services.promise) return cache.services.promise;

  if (!db) return Promise.resolve([]);

  cache.services.promise = firestoreService
    .getServices()
    .then((data) => {
      cache.services.data = data;
      cache.services.promise = null;
      return data;
    })
    .catch((err) => {
      cache.services.promise = null;
      throw err;
    });

  return cache.services.promise;
};

export const getCachedSliderImages = () => {
  if (cache.sliderImages.data) return Promise.resolve(cache.sliderImages.data);
  if (cache.sliderImages.promise) return cache.sliderImages.promise;

  if (!db) return Promise.resolve([]);

  cache.sliderImages.promise = firestoreService
    .getSliderImages()
    .then((data) => {
      cache.sliderImages.data = data;
      cache.sliderImages.promise = null;
      return data;
    })
    .catch((err) => {
      cache.sliderImages.promise = null;
      throw err;
    });

  return cache.sliderImages.promise;
};

export const getCachedCustomerFeedback = () => {
  if (cache.customerFeedback.data) return Promise.resolve(cache.customerFeedback.data);
  if (cache.customerFeedback.promise) return cache.customerFeedback.promise;

  if (!db) return Promise.resolve([]);

  cache.customerFeedback.promise = firestoreService
    .getCustomerFeedback()
    .then((data) => {
      cache.customerFeedback.data = data;
      cache.customerFeedback.promise = null;
      return data;
    })
    .catch((err) => {
      cache.customerFeedback.promise = null;
      throw err;
    });

  return cache.customerFeedback.promise;
};

export const prefetchCustomerData = async () => {
  const [servicesResult, sliderResult, feedbackResult] = await Promise.allSettled([
    getCachedServices(),
    getCachedSliderImages(),
    getCachedCustomerFeedback(),
  ]);

  return {
    services: servicesResult.status === 'fulfilled' ? servicesResult.value : [],
    sliderImages: sliderResult.status === 'fulfilled' ? sliderResult.value : [],
    customerFeedback: feedbackResult.status === 'fulfilled' ? feedbackResult.value : [],
    errors: {
      services: servicesResult.status === 'rejected' ? servicesResult.reason : null,
      sliderImages: sliderResult.status === 'rejected' ? sliderResult.reason : null,
      customerFeedback: feedbackResult.status === 'rejected' ? feedbackResult.reason : null,
    },
  };
};

export const invalidateCache = (key) => {
  if (key) {
    if (cache[key]) {
      cache[key].data = null;
      cache[key].promise = null;
    }
  } else {
    Object.keys(cache).forEach((k) => {
      cache[k].data = null;
      cache[k].promise = null;
    });
  }
};
