import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../supabaseClient';
import { drugCategories } from '../data/mockData';
import MoroccoMap from '../components/MoroccoMap';
import EmailSignupBanner from '../components/EmailSignupBanner';

export default function Dashboard() {
  const [shortages, setShortages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShortages();
  }, []);

  const fetchShortages = async () => {
    const { data, error } = await supabase
      .from('shortages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setShortages(data);
    setLoading(false);
  };

  const critical = shortages.filter(s => s.severity === 'critique').length;
  const moderate = shortages.filter(s => s.severity === 'modérée').length;
  const total = shortages.length;
  const wilayas = [...new Set(shortages.map(s => s.wilaya))].length;

  const categoryData = drugCategories.map(cat => ({
    name: cat.split(' ')[0],
    count: shortages.filter(s => s.category === cat).length
  })).filter(d => d.count > 0);

  const severityData = [
    { name: 'Critique', value: critical, color: '#ef4444' },
    { name: 'Modérée', value: moderate, color: '#f97316' },
    { name: 'Faible', value: shortages.filter(s => s.severity === 'faible').length, color: '#eab308' },
  ].filter(d => d.value > 0);

  const recentShortages = shortages.slice(0, 3);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1">Suivi des pénuries de médicaments au Maroc</p>
        </div>
        <Link to="/report" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Signaler une pénurie
        </Link>
      </div>

      {/* Email signup banner */}
      <EmailSignupBanner />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total signalements', value: total, color: 'text-gray-900' },
          { label: 'Critiques', value: critical, color: 'text-red-600' },
          { label: 'Modérées', value: moderate, color: 'text-orange-500' },
          { label: 'Wilayas touchées', value: wilayas, color: 'text-blue-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts + Map */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Pénuries par catégorie</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Répartition par sévérité</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {severityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Morocco Map — takes 1 column */}
        <MoroccoMap shortages={shortages} />
      </div>

      {/* Recent shortages */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Signalements récents</h2>
          <Link to="/shortages" className="text-blue-600 text-sm hover:underline">Voir tout →</Link>
        </div>
        <div className="space-y-3">
          {recentShortages.map(shortage => (
            <div key={shortage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  shortage.severity === 'critique' ? 'bg-red-500' :
                  shortage.severity === 'modérée' ? 'bg-orange-400' : 'bg-yellow-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{shortage.drug_name}</p>
                  <p className="text-xs text-gray-500">{shortage.wilaya} · {shortage.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  shortage.severity === 'critique' ? 'bg-red-100 text-red-700' :
                  shortage.severity === 'modérée' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {shortage.severity}
                </span>
                <p className="text-xs text-gray-400 mt-1">{shortage.created_at?.split('T')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}