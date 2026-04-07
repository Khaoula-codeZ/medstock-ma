import { useState, useEffect } from 'react';
import { initialShortages, wilayas, drugCategories } from '../data/mockData';

export default function Shortages() {
  const [shortages, setShortages] = useState([]);
  const [search, setSearch] = useState('');
  const [filterWilaya, setFilterWilaya] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('medstock_shortages');
    setShortages(stored ? JSON.parse(stored) : initialShortages);
  }, []);

  const handleVote = (id) => {
    const updated = shortages.map(s =>
      s.id === id ? { ...s, votes: s.votes + 1 } : s
    );
    setShortages(updated);
    localStorage.setItem('medstock_shortages', JSON.stringify(updated));
  };

  const filtered = shortages
    .filter(s => !search || s.drugName.toLowerCase().includes(search.toLowerCase()))
    .filter(s => !filterWilaya || s.wilaya === filterWilaya)
    .filter(s => !filterCategory || s.category === filterCategory)
    .filter(s => !filterSeverity || s.severity === filterSeverity)
    .sort((a, b) => b.votes - a.votes);

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

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Aucun signalement trouvé
          </div>
        ) : filtered.map(shortage => (
          <div key={shortage.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">

              <div className="flex gap-4 flex-1">
                {/* Vote */}
                <button
                  onClick={() => handleVote(shortage.id)}
                  className="flex flex-col items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors min-w-[52px]"
                >
                  <span className="text-gray-400 text-xs">▲</span>
                  <span className="text-sm font-semibold text-gray-700">{shortage.votes}</span>
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900">{shortage.drugName}</h3>
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
                    {shortage.wilaya} {shortage.facility && `· ${shortage.facility}`} · Signalé par {shortage.reportedBy} · {shortage.date}
                  </p>

                  <p className="text-sm text-gray-700 mb-2">{shortage.description}</p>

                  {shortage.alternatives && (
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-medium">Alternative:</span> {shortage.alternatives}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}