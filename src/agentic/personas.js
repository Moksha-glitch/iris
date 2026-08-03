// ============================================================
// 3-Persona System — Leadership / Service Provider / Segments
// ============================================================

export const PERSONAS = {
  leadership: {
    id: 'leadership',
    label: 'Leadership (Strategic)',
    shortLabel: 'Leadership',
    icon: '👔',
    color: '#1D4ED8',
    desc: 'KPIs, executive summaries, trend analysis, coverage',
  },
  serviceProvider: {
    id: 'serviceProvider',
    label: 'Service Provider (Operational)',
    shortLabel: 'Service Provider',
    icon: '🔧',
    color: '#166534',
    desc: 'SLA metrics, ticket volumes, operational bottlenecks',
  },
  segments: {
    id: 'segments',
    label: 'Segments (Analytical)',
    shortLabel: 'Segments',
    icon: '📊',
    color: '#7C3AED',
    desc: 'Deep-dive demographics, cohort analysis, segment behaviors',
  },
};

export function getPersonaConfig(id) {
  return PERSONAS[id] || PERSONAS.leadership;
}
