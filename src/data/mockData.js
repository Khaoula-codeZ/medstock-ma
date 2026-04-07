export const wilayas = [
  "Casablanca-Settat", "Rabat-Salé-Kénitra", "Fès-Meknès", "Marrakech-Safi",
  "Tanger-Tétouan-Al Hoceïma", "Souss-Massa", "Oriental", "Béni Mellal-Khénifra",
  "Drâa-Tafilalet", "Laâyoune-Sakia El Hamra", "Dakhla-Oued Ed-Dahab", "Guelmim-Oued Noun"
];

export const drugCategories = [
  "Oncologie", "Santé mentale / Psychiatrie", "Cardiologie", "Diabète / Endocrinologie",
  "Neurologie", "Infectiologie / Antibiotiques", "Radiopharmaceutiques", "Autre"
];

export const initialShortages = [
  {
    id: 1,
    drugName: "Trastuzumab (Herceptin)",
    category: "Oncologie",
    wilaya: "Fès-Meknès",
    facility: "CHU Hassan II",
    severity: "critique",
    reportedBy: "Oncologue",
    date: "2025-04-01",
    description: "Rupture totale depuis 3 semaines. Patients en attente de traitement.",
    alternatives: "Aucune alternative locale disponible",
    votes: 12
  },
  {
    id: 2,
    drugName: "Methylphenidate (Ritalin)",
    category: "Santé mentale / Psychiatrie",
    wilaya: "Casablanca-Settat",
    facility: "Clinique privée",
    severity: "critique",
    reportedBy: "Psychiatre",
    date: "2025-03-28",
    description: "Non disponible dans toutes les pharmacies. Familles contraintes d'importer.",
    alternatives: "Atomoxétine — difficile à trouver également",
    votes: 24
  },
  {
    id: 3,
    drugName: "Capecitabine (Xeloda)",
    category: "Oncologie",
    wilaya: "Marrakech-Safi",
    facility: "Hôpital Ibn Tofail",
    severity: "modérée",
    reportedBy: "Pharmacien hospitalier",
    date: "2025-03-25",
    description: "Stock insuffisant. Délais d'approvisionnement imprévisibles.",
    alternatives: "5-FU IV comme alternative — moins pratique pour le patient",
    votes: 8
  },
  {
    id: 4,
    drugName: "Fluorodésoxyglucose ¹⁸F (FDG)",
    category: "Radiopharmaceutiques",
    wilaya: "Fès-Meknès",
    facility: "Centre de médecine nucléaire",
    severity: "critique",
    reportedBy: "Médecin nucléaire",
    date: "2025-04-02",
    description: "Aucune production locale dans la région. Transport depuis Casablanca cause des pertes dues à la demi-vie courte.",
    alternatives: "Aucune",
    votes: 18
  },
  {
    id: 5,
    drugName: "Clozapine",
    category: "Santé mentale / Psychiatrie",
    wilaya: "Rabat-Salé-Kénitra",
    facility: "Hôpital Arrazi",
    severity: "modérée",
    reportedBy: "Psychiatre",
    date: "2025-03-20",
    description: "Ruptures fréquentes. Patients stabilisés mis en danger par les interruptions.",
    alternatives: "Olanzapine — efficacité moindre pour certains patients",
    votes: 15
  }
];