// ============================================================
// 3-Persona System — Leadership / Service Provider / Segments
// ============================================================

export const PERSONAS = {
  leadership: {
    id: 'leadership',
    label: 'Leadership (Strategic)',
    shortLabel: 'Leadership',
    role: 'Strategic',
    initials: 'LD',
    icon: '👔',
    color: '#1D4ED8',
    desc: 'KPIs, executive summaries, trend analysis, coverage',
    username: 'Leadership',
    password: 'Leadership',
  },
  serviceProvider: {
    id: 'serviceProvider',
    label: 'Service Provider (Operational)',
    shortLabel: 'Service Provider',
    role: 'Operations',
    initials: 'SP',
    icon: '🔧',
    color: '#166534',
    desc: 'SLA metrics, ticket volumes, operational bottlenecks',
    username: 'Service Provider',
    password: 'Service Provider',
  },
  segments: {
    id: 'segments',
    label: 'Segments (Analytical)',
    shortLabel: 'Segments',
    role: 'Analytics',
    initials: 'SG',
    icon: '📊',
    color: '#7C3AED',
    desc: 'Deep-dive demographics, cohort analysis, segment behaviors',
    username: 'Segments',
    password: 'Segments',
  },
};

export function getPersonaConfig(id) {
  return PERSONAS[id] || PERSONAS.leadership;
}

export function normalizeAccountName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

/** Username and password must match each other and a persona name. */
export function matchPersonaAccount(username, password) {
  const user = normalizeAccountName(username);
  const pass = normalizeAccountName(password);
  if (!user || user !== pass) return null;
  return (
    Object.values(PERSONAS).find((p) =>
      [p.id, p.shortLabel, p.username].some((n) => normalizeAccountName(n) === user)
    ) || null
  );
}
