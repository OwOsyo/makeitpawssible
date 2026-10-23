export const HEALTH_STATUSES = {
  healthy: {
    key: 'healthy',
    label: 'Healthy',
    pill: 'bg-[#A8DADC]/40 text-[#1D3557] border-[#A8DADC]',
    dot: 'bg-[#457B9D]',
    note: 'Full bill of health',
  },
  monitoring: {
    key: 'monitoring',
    label: 'Monitoring',
    pill: 'bg-[#457B9D]/10 text-[#1D3557] border-[#457B9D]/40',
    dot: 'bg-[#1D3557]',
    note: 'Watching a small change',
  },
  recovering: {
    key: 'recovering',
    label: 'Recovering',
    pill: 'bg-[#457B9D]/20 text-[#1D3557] border-[#457B9D]/60',
    dot: 'bg-[#457B9D]',
    note: 'Healing, on a care plan',
  },
  treatment: {
    key: 'treatment',
    label: 'In treatment',
    pill: 'bg-[#E63946]/10 text-[#E63946] border-[#E63946]/40',
    dot: 'bg-[#E63946]',
    note: 'Under active medical care',
  },
  special: {
    key: 'special',
    label: 'Special care',
    pill: 'bg-[#1D3557]/10 text-[#1D3557] border-[#1D3557]/30',
    dot: 'bg-[#1D3557]',
    note: 'Long-term, gentle support',
  },
};

export const FILTERS = [
  { key: 'all', label: 'Everyone' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'recovering', label: 'Recovering' },
  { key: 'treatment', label: 'In treatment' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'special', label: 'Special care' },
];

export const statusMeta = (key) => HE