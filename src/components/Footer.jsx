export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">MedStock MA</p>
          <p className="text-xs text-gray-400 mt-0.5">Suivi des pénuries de médicaments au Maroc</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-500">
          <a href="mailto:medstockma@gmail.com" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            <span>✉️</span>
            <span>medstockma@gmail.com</span>
          </a>
          <span className="hidden sm:block text-gray-300">|</span>
          <span>© {new Date().getFullYear()} MedStock MA. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}