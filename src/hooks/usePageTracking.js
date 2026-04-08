import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackView = async () => {
      await supabase.from('page_views').insert([
        { page: location.pathname }
      ]);
    };
    trackView();
  }, [location.pathname]);
}