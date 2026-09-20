import React, { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that whenever a route navigation occurs (including
 * navigating back from the login page to the landing page), the browser scroll
 * is immediately reset to the top (0, 0), matching initial page load state.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  // Disable automatic browser scroll restoration so back/forward navigation
  // doesn't restore arbitrary scrolled offsets
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Synchronously reset scroll before paint when route changes without a hash
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};
