import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';
import CallButton from '../components/common/CallButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CustomerDataProvider } from '../contexts/CustomerDataContext';

const CustomerLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <CustomerDataProvider>
      <div className="min-h-screen flex flex-col bg-[var(--surface-2)] text-ink-900">
        <Header />
        {/* All pages sit below the fixed header (h-16 mobile / h-[72px] desktop) */}
        <main className="flex-1 pt-16 lg:pt-[72px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <WhatsAppButton />
        <CallButton />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
          toastClassName="!rounded-xl !font-medium"
        />
      </div>
    </CustomerDataProvider>
  );
};

export default CustomerLayout;
