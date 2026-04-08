import { useState } from 'react';
import { supabase } from '../supabaseClient';

const WILAYAS = [
  'Tanger-Tétouan-Al Hoceïma', 'Oriental', 'Fès-Meknès', 'Rabat-Salé-Kénitra',
  'Béni Mellal-Khénifra', 'Casablanca-Settat', 'Marrakech-Safi',
  'Drâa-Tafilalet', 'Souss-Massa', 'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab'
];

export default function EmailSignupBanner() {
  const [email, setEmail] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    const { error } = await supabase.from('subscribers').insert([{ email, wilaya: wilaya || null }]);
    if (error) {
      if (error.code === '23505') {
        setStatus('success'); // already subscribed, treat as ok
      } else {
        setStatus('error');
      }
    } else {
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <span className="text-green-600 text-xl">✓</span>
        <p className="text-green-700 text-sm font-medium">
          Inscrit ! Vous serez alerté des nouvelles pénuries dans votre région.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-blue-800 font-semibold text-sm mb-3">
        🔔 Recevoir des alertes pénuries pour votre wilaya
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={wilaya}
          onChange={e => setWilaya(e.target.value)}
          className="px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="">Toutes les wilayas</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'M\'alerter'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-500 text-xs mt-2">Erreur, réessayez.</p>
      )}
    </div>
  );
}