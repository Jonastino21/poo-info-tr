// src/mocks/repartitionsMocks-azir.js

// Tableau de créneaux factices
export const mockEvents = [
  {
    id: 1,
    title: 'TP Réseaux - Groupe A',
    start: new Date('2025-06-10T09:00'),
    end: new Date('2025-06-10T11:00'),
    ressourceId: 101,
    ressourceLabel: 'Salle TP1',
    groupe: 'Groupe A',
  },
  {
    id: 2,
    title: 'Cours Théorie - Groupe B',
    start: new Date('2025-06-10T11:30'),
    end: new Date('2025-06-10T13:00'),
    ressourceId: 102,
    ressourceLabel: 'Salle Cours 2',
    groupe: 'Groupe B',
  },
  {
    id: 3,
    title: 'Maintenance Switch',
    start: new Date('2025-06-11T14:00'),
    end: new Date('2025-06-11T15:00'),
    ressourceId: 201,
    ressourceLabel: 'Switch Réseau 3',
    groupe: 'Technicien Réseaux',
  },
  {
    id: 4,
    title: 'TP Sécurité - Groupe C',
    start: new Date('2025-06-12T08:00'),
    end: new Date('2025-06-12T10:00'),
    ressourceId: 103,
    ressourceLabel: 'Salle TP2',
    groupe: 'Groupe C',
  },
];

// Tableau des ressources factices (avec une option “Tous” pour le filtre)
export const mockRessources = [
  { id: 'Tous', libelle: 'Toutes les ressources' },
  { id: 101, libelle: 'Salle TP1' },
  { id: 102, libelle: 'Salle Cours 2' },
  { id: 201, libelle: 'Switch Réseau 3' },
  { id: 103, libelle: 'Salle TP2' },
];
