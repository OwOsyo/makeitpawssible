export const PAGE_TEXT = {
  hero_eyebrow: 'student-run since 2023',
  hero_title: 'Every cat on campus has a name, a chart, and a guardian.',
  hero_subtitle:
    'We are the student volunteer team who feed, medicate, and nurse the campus cats back to health. Every chart on this page is written by a student — so you can see exactly how each cat is doing, and exactly what they still need.',
  hero_cta_primary: 'Meet the colony',
  hero_cta_secondary: 'Support their care',
  hero_note: 'Feeding rounds daily before assembly · Visitors welcome,',
  stat_1_label: 'Cats on our chart',
  stat_2_label: 'Currently on a care plan',
  stat_3_label: 'Ready for a home',
  stat_4_label: 'Run by students, unpaid',
  stat_4_value: '100%',
  ledger_eyebrow: 'The colony ledger',
  ledger_title: 'Everyone we are responsible for, in plain view.',
  ledger_subtitle:
    'Tap any cat to open their full health chart — checkups, weight, and what they still need this month.',
  ledger_empty_title: 'Nobody in this group right now.',
  ledger_empty_subtitle: 'Try another status to see the rest of the colony.',
  care_eyebrow: 'How we care',
  care_title: 'The same four steps, for every cat, every week.',
  care_step1_title: 'Feed, every single day',
  care_step1_body:
    'Two volunteers take the morning and afternoon rounds with wet food and clean water. Weight and appetite go straight onto the chart.',
  care_step2_title: 'Vet first, always',
  care_step2_body:
    'Any new cat is checked, vaccinated and — where the vet agrees — sterilised, so the colony stays small and healthy.',
  care_step3_title: 'Treat at school',
  care_step3_body:
    'Meds, steam therapy and post-surgery recovery happen in the quiet rooms we are allowed to use, supervised by a teacher.',
  care_step4_title: 'Find them a home',
  care_step4_body:
    'Cats cleared as healthy are matched with families from our school community, with a home visit before adoption.',
  care_footnote:
    'Statuses on this page are updated by the volunteer on duty. If something looks out of date, tell us at the weekly meeting.',
  donate_eyebrow: 'Donations',
  donate_title: 'Scan once. Keep a chart green.',
  donate_description:
    'Every donation goes straight into the colony fund: food, medicine, and vet bills. No salaries, no overheads — the team is made up of students who volunteer their time.',
  donate_cost1_title: 'Food & litter',
  donate_cost1_body: 'Wet food, kibble and litter for the whole colony, bought monthly.',
  donate_cost2_title: 'Vet care & medicine',
  donate_cost2_body: 'Checkups, vaccinations, antibiotics and sterilisation surgery.',
  donate_cost3_title: 'Shelter & bedding',
  donate_cost3_body: 'Warm bedding, carriers, and quiet recovery space in school.',
  donate_receipt_note:
    'Receipts and a monthly spending summary are pinned on the volunteer noticeboard next to Room 2.',
  donate_scan_label: 'Scan to donate',
  donate_qr_placeholder: 'Donation QR coming soon',
  donate_cta_open: 'Open donation page',
  donate_cta_email: 'Email the committee',
  volunteer_eyebrow: 'Join the team',
  volunteer_title: 'The colony needs another guardian. Will it be you?',
  volunteer_description:
    'Anyone in the school can join, in any year group. No experience needed — a senior volunteer shows you everything on your first round.',
  volunteer_meeting_label: 'We meet every week',
  volunteer_meeting_note: 'Newcomers welcome — just turn up.',
  volunteer_cta: 'Sign up to volunteer',
  volunteer_role1_title: 'Feeding round',
  volunteer_role1_commitment: '20 min, once a week',
  volunteer_role1_body:
    'Refill bowls, note appetite, and log it on the colony sheet before first period.',
  volunteer_role2_title: 'Vet escort',
  volunteer_role2_commitment: 'One afternoon a month',
  volunteer_role2_body:
    'Travel with a cat to the clinic, keep the carrier calm, and file the vet report.',
  volunteer_role3_title: 'Recovery foster',
  volunteer_role3_commitment: 'A week or two at home',
  volunteer_role3_body:
    'Give a recovering cat a quiet room, follow the med schedule, send photo updates.',
  volunteer_footnote:
    'Volunteers under 16 need a parent’s acknowledgement for clinic trips. Ask the teacher-in-charge for the form at the weekly meeting.',
  footer_colophon: 'Run by students, for the cats.',
  footer_donation_note: 'Donations go to the colony fund only.',
};

export const pageText = (settings, key) => settings?.[key] || PAGE_TEXT[key];

export const PAGE_TEXT_GROUPS = [
  {
    title: 'Hero',
    fields: [
      { key: 'hero_eyebrow', label: 'Eyebrow line (after the school name)' },
      { key: 'hero_title', label: 'Headline', multiline: true },
      { key: 'hero_subtitle', label: 'Sub-headline', multiline: true },
      { key: 'hero_cta_primary', label: 'Primary button' },
      { key: 'hero_cta_secondary', label: 'Secondary button' },
      { key: 'hero_note', label: 'Small note (start of the meeting line)' },
    ],
  },
  {
    title: 'Impact strip',
    fields: [
      { key: 'stat_1_label', label: 'Stat 1 label' },
      { key: 'stat_2_label', label: 'Stat 2 label' },
      { key: 'stat_3_label', label: 'Stat 3 label' },
      { key: 'stat_4_label', label: 'Stat 4 label' },
      { key: 'stat_4_value', label: 'Stat 4 value' },
    ],
  },
  {
    title: 'Colony ledger',
    fields: [
      { key: 'ledger_eyebrow', label: 'Eyebrow line' },
      { key: 'ledger_title', label: 'Section heading', multiline: true },
      { key: 'ledger_subtitle', label: 'Intro note', multiline: true },
      { key: 'ledger_empty_title', label: 'Empty-state title' },
      { key: 'ledger_empty_subtitle', label: 'Empty-state note' },
    ],
  },
  {
    title: 'How we care',
    fields: [
      { key: 'care_eyebrow', label: 'Eyebrow line' },
      { key: 'care_title', label: 'Section heading', multiline: true },
      { key: 'care_step1_title', label: 'Step 1 title' },
      { key: 'care_step1_body', label: 'Step 1 text', multiline: true },
      { key: 'care_step2_title', label: 'Step 2 title' },
      { key: 'care_step2_body', label: 'Step 2 text', multiline: true },
      { key: 'care_step3_title', label: 'Step 3 title' },
      { key: 'care_step3_body', label: 'Step 3 text', multiline: true },
      { key: 'care_step4_title', label: 'Step 4 title' },
      { key: 'care_step4_body', label: 'Step 4 text', multiline: true },
      { key: 'care_footnote', label: 'Footnote under the steps', multiline: true },
    ],
  },
  {
    title: 'Donations',
    fields: [
      { key: 'donate_eyebrow', label: 'Eyebrow line' },
      { key: 'donate_title', label: 'Section heading' },
      { key: 'donate_description', label: 'Description', multiline: true },
      { key: 'donate_cost1_title', label: 'Cost 1 title' },
      { key: 'donate_cost1_body', label: 'Cost 1 text', multiline: true },
      { key: 'donate_cost2_title', label: 'Cost 2 title' },
      { key: 'donate_cost2_body', label: 'Cost 2 text', multiline: true },
      { key: 'donate_cost3_title', label: 'Cost 3 title' },
      { key: 'donate_cost3_body', label: 'Cost 3 text', multiline: true },
      { key: 'donate_receipt_note', label: 'Receipts note', multiline: true },
      { key: 'donate_scan_label', label: 'QR frame label' },
      { key: 'donate_qr_placeholder', label: 'QR placeholder text' },
      { key: 'donate_cta_open', label: '“Open donation page” button' },
      { key: 'donate_cta_email', label: '“Email the committee” button' },
    ],
  },
  {
    title: 'Volunteer',
    fields: [
      { key: 'volunteer_eyebrow', label: 'Eyebrow line' },
      { key: 'volunteer_title', label: 'Section heading', multiline: true },
      { key: 'volunteer_description', label: 'Description', multiline: true },
      { key: 'volunteer_meeting_label', label: 'Meeting box title' },
      { key: 'volunteer_meeting_note', label: 'Meeting box note' },
      { key: 'volunteer_cta', label: 'Sign-up button' },
      { key: 'volunteer_role1_title', label: 'Role 1 title' },
      { key: 'volunteer_role1_commitment', label: 'Role 1 commitment' },
      { key: 'volunteer_role1_body', label: 'Role 1 text', multiline: true },
      { key: 'volunteer_role2_title', label: 'Role 2 title' },
      { key: 'volunteer_role2_commitment', label: 'Role 2 commitment' },
      { key: 'volunteer_role2_body', label: 'Role 2 text', multiline: true },
      { key: 'volunteer_role3_title', label: 'Role 3 title' },
      { key: 'volunteer_role3_commitment', label: 'Role 3 commitment' },
      { key: 'volunteer_role3_body', label: 'Role 3 text', multiline: true },
      { key: 'volunteer_footnote', label: 'Footnote', multiline: true },
    ],
  },
  {
    title: 'Footer',
    fields: [
      { key: 'footer_colophon', label: 'Colophon (after the name)' },
      { key: 'footer_donation_note', label: 'Donations note' },
    ],
  },
];