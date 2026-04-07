import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { wilayas, drugCategories } from '../data/mockData';

export default function ReportShortage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    drug_name: '',
    category: '',
    wilaya: '',
    facility: '',
    severity: '',
    reported_by: '',
    description: '',
    alternatives: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('shortages')
      .insert([{ ...form, votes: 0 }]);
    setLoading(false);
    if (!error) setSubmitted(true);
    else alert('Erreur lors de la soumission. Réessayez.');
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pénurie signalée</h2>
        <p className="text-gray-500 mb-6">Merci. Votre signalement aide à cartographier les manques en médicaments au Maroc.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSubmitted(false); setForm({ drug_name:'', category:'', wilaya:'', facility:'', severity:'', reported_by:'', description:'', alternatives:'' }); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Signaler une autre
          </button>
          <button
            onClick={() => navigate('/shortages')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Voir les pénuries →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Signaler une pénurie</h1>
        <p className="text-gray-500 text-sm mt-1">Aidez à cartographier les médicaments manquants au Maroc</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du médicament *</label>
          <input
            name="drug_name"
            value={form.drug_name}
            onChange={handleChange}
            required
            placeholder="ex: Trastuzumab, Methylphenidate..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner...</option>
              {drugCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya *</label>
            <select
              name="wilaya"
              value={form.wilaya}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner...</option>
              {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
            <input
              name="facility"
              value={form.facility}
              onChange={handleChange}
              placeholder="ex: CHU Ibn Sina..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sévérité *</label>
            <select
              name="severity"
              value={form.severity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner...</option>
              <option value="critique">Critique — aucun stock</option>
              <option value="modérée">Modérée — stock faible</option>
              <option value="faible">Faible — approvisionnement irrégulier</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vous êtes *</label>
          <select
            name="reported_by"
            value={form.reported_by}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            {['Médecin', 'Oncologue', 'Psychiatre', 'Pharmacien', 'Pharmacien hospitalier', 'Infirmier', 'Patient', 'Autre'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Depuis quand ? Combien de patients affectés ? Impact clinique..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alternatives utilisées</label>
          <input
            name="alternatives"
            value={form.alternatives}
            onChange={handleChange}
            placeholder="Quel substitut utilisez-vous ? Ou aucun disponible..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Soumettre le signalement'}
        </button>
      </form>
    </div>
  );
}