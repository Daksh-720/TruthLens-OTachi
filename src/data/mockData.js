export const SAMPLE_CLAIMS = {
  health:
    'A widely shared post claims a new study proves vitamin D3 supplements at 10,000 IU/day eliminate all COVID-19 risk, citing a single non-peer-reviewed preprint.',
  screenshot:
    'Breaking screenshot purporting to be from a national news broadcaster announcing an unexpected nationwide bank holiday and withdrawal limits starting tomorrow.',
  photo:
    'Viral aerial photograph claiming to show catastrophic flooding in Mumbai today, originally captured during the 2019 monsoon season.'
};

export const INITIAL_HISTORY = [
  {
    id: 'h-1',
    claim: 'Photo claiming to show 2026 flood in coastal city is actually from 2019 monsoon',
    verdict: 'POTENTIALLY MANIPULATED',
    score: 18,
    confidence: 91,
    checked: '2026-09-02 14:22',
    model: 'tl-v4.2.1'
  },
  {
    id: 'h-2',
    claim: 'Government announcement about new tax exemption thresholds for startup investments',
    verdict: 'GENUINE',
    score: 88,
    confidence: 94,
    checked: '2026-09-01 09:15',
    model: 'tl-v4.2.1'
  },
  {
    id: 'h-3',
    claim: 'Celebrity endorsement of unregulated crypto token promising 400% weekly returns',
    verdict: 'FAKE',
    score: 12,
    confidence: 87,
    checked: '2026-08-31 18:40',
    model: 'tl-v4.2.1'
  },
  {
    id: 'h-4',
    claim: 'Study on coffee reducing liver disease risk published in peer-reviewed hepatology journal',
    verdict: 'GENUINE',
    score: 79,
    confidence: 82,
    checked: '2026-08-30 11:08',
    model: 'tl-v4.2.1'
  },
  {
    id: 'h-5',
    claim: 'Out-of-context quote attributed to central bank governor on currency devaluation',
    verdict: 'MISLEADING',
    score: 31,
    confidence: 76,
    checked: '2026-08-29 15:33',
    model: 'tl-v4.2.1'
  },
  {
    id: 'h-6',
    claim: 'Edited video of politician appearing to stumble on stairs, speed altered by 1.4x',
    verdict: 'POTENTIALLY MANIPULATED',
    score: 22,
    confidence: 89,
    checked: '2026-08-28 20:11',
    model: 'tl-v4.2.1'
  },
  {
    id: 'h-7',
    claim: 'WHO announces updated flu vaccine composition recommendations for upcoming season',
    verdict: 'GENUINE',
    score: 91,
    confidence: 96,
    checked: '2026-08-27 09:50',
    model: 'tl-v4.2.1'
  }
];

export const INITIAL_TRENDS = [
  {
    id: 'tr-1',
    topic: 'Altered election ballot scanning video circulating across messaging groups',
    category: 'Elections',
    velocity: 'High (+240%)',
    verdict: 'FAKE',
    flagCount: 3820,
    time: '2h ago'
  },
  {
    id: 'tr-2',
    topic: 'Supposed leaked memo alleging nationwide salt and essential spice shortage',
    category: 'Commodities',
    velocity: 'High (+185%)',
    verdict: 'FAKE',
    flagCount: 2940,
    time: '4h ago'
  },
  {
    id: 'tr-3',
    topic: 'Selective clip of medical doctor discussing side effects without benefit context',
    category: 'Health',
    velocity: 'Medium (+95%)',
    verdict: 'MISLEADING',
    flagCount: 1420,
    time: '8h ago'
  },
  {
    id: 'tr-4',
    topic: 'Deepfake audio of CEO announcing unexpected stock buyback cancellation',
    category: 'Finance',
    velocity: 'High (+310%)',
    verdict: 'POTENTIALLY MANIPULATED',
    flagCount: 2110,
    time: '1h ago'
  }
];

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
