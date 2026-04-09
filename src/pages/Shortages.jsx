import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { wilayas, drugCategories } from '../data/mockData';



function SupplierModal({ shortage, onClose }) {
  const [form, setForm] = useState({ city: '', contact: '', contact_type: 'email' });
  const [status, setStatus] = useState('idle');
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, [shortage.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSuppliers = async () => {
    const { data } = await supabase
      .from('suppliers')
      .select('*')
      .eq('shortage_id', shortage.id)
      .order('created_at', { ascending: false });
    if (data) setSuppliers(data);
  };

  const handleSubmit = async () => {
    if (!form.city || !form.contact) return;
    setStatus('loading');
    const { error } = await supabase.from('suppliers').insert([{
      shortage_id: shortage.id,
      drug_name: shortage.drug_name,
      city: form.city,
      contact: form.contact,
      contact_type: form.contact_type,
    }]);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      fetchSuppliers();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Disponibilité signalée</h2>
            <p className="text-xs text-gray-400 mt-0.5">{shortage.drug_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Existing suppliers */}
        <div className="p-5">
          {suppliers.length > 0 ? (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {suppliers.length} pharmacie{suppliers.length > 1 ? 's' : ''} avec ce médicament
              </p>
              <div className="space-y-2">
                {suppliers.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.city}</p>
                      <p className="text-xs text-gray-500">{s.contact_type === 'email' ? '✉️' : '📞'} {s.contact}</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">En stock</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-5 text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-lg">
              Aucune pharmacie n'a encore signalé ce médicament
            </div>
          )}

          {/* Add supplier form */}
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-medium text-sm">✓ Merci ! Votre disponibilité a été ajoutée.</p>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Vous avez ce médicament ?
              </p>
              <div className="space-y-2">
                <input
                  placeholder="Ville (ex: Meknès)"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex gap-2">
                  <select
                    value={form.contact_type}
                    onChange={e => setForm({ ...form, contact_type: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Téléphone</option>
                  </select>
                  <input
                    placeholder={form.contact_type === 'email' ? 'votre@email.com' : '06XXXXXXXX'}
                    value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={status === 'loading' || !form.city || !form.contact}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {status === 'loading' ? 'Envoi...' : '✓ Signaler ma disponibilité'}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-xs text-center">Erreur, réessayez.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shortages() {
  const [shortages, setShortages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterWilaya, setFilterWilaya] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    fetchShortages();
  }, []);

  const fetchShortages = async () => {
    const { data, error } = await supabase
      .from('shortages')
      .select('*')
      .order('votes', { ascending: false });
    if (!error) setShortages(data);
    setLoading(false);
  };

  const handleVote = async (id, currentVotes) => {
    const { error } = await supabase
      .from('shortages')
      .update({ votes: currentVotes + 1 })
      .eq('id', id);
    if (!error) {
      setShortages(shortages.map(s =>
        s.id === id ? { ...s, votes: currentVotes + 1 } : s
      ));
    }
  };

  const filtered = shortages
    .filter(s => !search || s.drug_name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => !filterWilaya || s.wilaya === filterWilaya)
    .filter(s => !filterCategory || s.category === filterCategory)
    .filter(s => !filterSeverity || s.severity === filterSeverity);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pénuries signalées</h1>
        <p className="text-gray-500 text-sm mt-1">{filtered.length} signalement{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-4 gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un médicament..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterWilaya}
            onChange={e => setFilterWilaya(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les wilayas</option>
            {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            {drugCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes sévérités</option>
            <option value="critique">Critique</option>
            <option value="modérée">Modérée</option>
            <option value="faible">Faible</option>
          </select>
        </div>
      </div>

      {/* Shortage cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Aucun signalement trouvé</div>
        ) : filtered.map(shortage => (
          <div key={shortage.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleVote(shortage.id, shortage.votes)}
                className="flex flex-col items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors min-w-[52px]"
              >
                <span className="text-gray-400 text-xs">▲</span>
                <span className="text-sm font-semibold text-gray-700">{shortage.votes}</span>
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-gray-900">{shortage.drug_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    shortage.severity === 'critique' ? 'bg-red-100 text-red-700' :
                    shortage.severity === 'modérée' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {shortage.severity}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                    {shortage.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {shortage.wilaya} {shortage.facility && `· ${shortage.facility}`} · Signalé par {shortage.reported_by} · {shortage.created_at?.split('T')[0]}
                </p>
                <p className="text-sm text-gray-700 mb-3">{shortage.description}</p>
                {shortage.alternatives && (
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                    <span className="font-medium">Alternative:</span> {shortage.alternatives}
                  </div>
                )}

                {/* CTA button */}
                <button
                  onClick={() => setActiveModal(shortage)}
                  className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span>💊</span>
                  <span>J'ai ce médicament en stock</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {activeModal && (
        <SupplierModal
          shortage={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}