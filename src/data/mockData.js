export const SAMPLE_CLAIMS = {
  health:
    'A widely shared post claims a new study proves vitamin D3 supplements at 10,000 IU/day eliminate all COVID-19 risk, citing a single non-peer-reviewed preprint.',
  screenshot:
    'Breaking screenshot purporting to be from a national news broadcaster announcing an unexpected nationwide bank holiday and withdrawal limits starting tomorrow.',
  photo:
    'Viral aerial photograph claiming to show catastrophic flooding in Mumbai today, originally captured during the 2019 monsoon season.'
};

// History starts empty - real-time verified claims from the workbench are dynamically logged and persisted
export const INITIAL_HISTORY = [];

// Trends are scraped dynamically in real-time on site launch
export const INITIAL_TRENDS = [];


export const INITIAL_QUEUE = [
  {
    id: 'q-101',
    claim: 'Voice note claiming drinking saltwater before tests invalidates virus detection',
    source: 'Telegram Channel (42k subscribers)',
    status: 'Pending Review',
    confidenceScore: '52% (Ambiguous)',
    flagReason: 'Potential public health risk'
  },
  {
    id: 'q-102',
    claim: 'Manipulated screenshot claiming city council voted to eliminate property taxes',
    source: 'X / Twitter post',
    status: 'Flagged for Escalation',
    confidenceScore: '38% (Low)',
    flagReason: 'Official gazette contradicts headline'
  },
  {
    id: 'q-103',
    claim: 'Audio recording alleged to be closed-door defense ministry briefing',
    source: 'WhatsApp Forward (frequently forwarded tag)',
    status: 'Audio Forensics Pending',
    confidenceScore: '61% (Synthesized voice signature)',
    flagReason: 'Suspected deepfake voice cloning'
  }
];
