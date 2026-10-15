export interface Word {
  id: string;
  label: string;
  icon: string;
  definition: string;
  example: string;
  cue: [number, number];
  recall: string;
  choices: string[];
  answer: number;
}
export const words: Word[] = [
  {
    id: 'notice',
    label: 'notice',
    icon: 'eye',
    definition: 'To see or become aware of something.',
    example: 'Maya noticed an empty space in the cabinet.',
    cue: [10.4, 17.8],
    recall: 'You spot muddy footprints near the door. What did you do?',
    choices: ['Notice them', 'Polish them', 'Forget them'],
    answer: 0,
  },
  {
    id: 'puzzled',
    label: 'puzzled',
    icon: 'puzzled',
    definition: 'Unsure because something is difficult to understand.',
    example: 'Leo felt puzzled because the trophy was missing.',
    cue: [36.8, 44],
    recall: 'A strange message makes no sense yet. How might you feel?',
    choices: ['Relieved', 'Puzzled', 'Sleepy'],
    answer: 1,
  },
  {
    id: 'investigate',
    label: 'investigate',
    icon: 'glass',
    definition: 'To look carefully for facts and clues.',
    example: 'The detectives investigated the trail of glitter.',
    cue: [68.55, 77],
    recall: 'You compare clues to find out what happened. You…',
    choices: ['Ignore', 'Celebrate', 'Investigate'],
    answer: 2,
  },
  {
    id: 'relieved',
    label: 'relieved',
    icon: 'relieved',
    definition: 'Happy and relaxed because a worry has gone away.',
    example: 'Maya felt relieved because the trophy was safe.',
    cue: [107.5, 116],
    recall: 'You find your missing bag safe at reception. You feel…',
    choices: ['Relieved', 'Puzzled', 'Worried'],
    answer: 0,
  },
];
export const chapters = [
  {
    start: 0,
    end: 30.15,
    scene: 0,
    title: 'An empty space',
    caption:
      'Maya and Leo notice something unusual in the school trophy cabinet.',
  },
  {
    start: 30.15,
    end: 62.05,
    scene: 1,
    title: 'A puzzling discovery',
    caption:
      'The trophy is missing. The detectives feel puzzled. What could have happened?',
  },
  {
    start: 64.65,
    end: 94.8,
    scene: 2,
    title: 'Follow the evidence',
    caption:
      'Maya and Leo investigate. Look carefully for a trail of gold glitter.',
  },
  {
    start: 94.8,
    end: 133.2,
    scene: 3,
    title: 'The art room',
    caption:
      'Mr Clark has been polishing the trophy. The trophy is safe! Everyone feels relieved.',
  },
  {
    start: 133.2,
    end: 147.9,
    scene: 3,
    title: 'Repair the report',
    caption: 'I felt relieved because the mystery was solved.',
  },
  {
    start: 153.95,
    end: 160.4,
    scene: 3,
    title: 'Case closed',
    caption:
      'Notice. Puzzled. Investigate. Relieved. Keep these words in your detective notebook.',
  },
];
// A confidence-first Year 6 pathway. It deliberately begins with secure KS2
// foundations and introduces Year 6 bridges only after a clear worked model.
// Ratio and formal algebra are not used as cold-start questions.
export const puzzles = [
  {
    id: 'place-value', name: 'The place-value beacon', strand: 'Number', reviewYear: 4,
    objective: 'Recognise the value of a digit in a five-digit number.',
    known: 'The number is 34,782. The digit 7 is in the hundreds column.',
    find: 'What is the value of the digit 7?',
    question: 'In 34,782, the digit 7 means seven hundreds.', prompt: 'Value of 7 = ?', answer: '700',
    acceptedAnswers: ['700'], hint: 'Read the columns: ten-thousands, thousands, hundreds, tens, ones.',
    language: '“Value” means how much the digit is worth because of its place. It does not mean the digit name.',
    explain: 'The 7 is in the hundreds column, so its value is 700.',
    extension: 'In 68,241, what is the value of the digit 8?', extensionAnswer: '8000',
    extensionExplain: 'The 8 is in the thousands column, so its value is 8,000.', model: 'place-value',
  },
  {
    id: 'grouping', name: 'The crystal stores', strand: 'Multiplication', reviewYear: 3,
    objective: 'Use multiplication facts to solve a division problem.',
    known: 'There are 24 crystals. Each box holds exactly 6 crystals.',
    find: 'How many full boxes are needed?',
    question: 'Make equal groups of 6 until all 24 crystals are packed.', prompt: '24 ÷ 6 = ?', answer: '4',
    acceptedAnswers: ['4'], hint: 'Count in sixes: 6, 12, 18, 24. Count how many jumps you made.',
    language: '“Each box holds 6” means every group must contain 6. You are finding the number of groups.',
    explain: 'Four groups of 6 make 24, so 24 ÷ 6 = 4 boxes.',
    extension: '36 crystals, with 6 in each box. How many boxes?', extensionAnswer: '6',
    extensionExplain: 'Six groups of 6 make 36, so 36 ÷ 6 = 6.', model: 'groups',
  },
  {
    id: 'fraction-amount', name: 'The fraction garden', strand: 'Fractions', reviewYear: 4,
    objective: 'Find a fraction of an amount using equal groups.',
    known: 'There are 20 lanterns, split into 4 equal groups. Three groups are lit.',
    find: 'How many lanterns are lit?',
    question: 'Find three quarters of 20.', prompt: '3/4 of 20 = ?', answer: '15',
    acceptedAnswers: ['15'], hint: 'First find one quarter: 20 ÷ 4 = 5. Then take 3 groups.',
    language: 'The denominator 4 tells you to make 4 equal groups. The numerator 3 tells you to use 3 of them.',
    explain: 'One quarter of 20 is 5. Three quarters is 3 × 5 = 15.',
    extension: 'What is 3/4 of 28?', extensionAnswer: '21',
    extensionExplain: '28 ÷ 4 = 7, then 3 × 7 = 21.', model: 'fraction-amount',
  },
  {
    id: 'percent-bridge', name: 'The hundred-gate', strand: 'Fractions and percentages', reviewYear: 5,
    objective: 'Connect 25% with one quarter and find it for an amount.',
    known: '25% means 25 out of 100. It is the same as one quarter.',
    find: 'What is 25% of 40?',
    question: 'Find one quarter of 40.', prompt: '25% of 40 = ?', answer: '10',
    acceptedAnswers: ['10'], hint: 'Because 25% = 1/4, divide 40 by 4.',
    language: '“25% of 40” means take one quarter of the 40 items. The word “of” tells you to find part of an amount.',
    explain: '25% is one quarter. 40 ÷ 4 = 10.',
    extension: 'What is 25% of 60?', extensionAnswer: '15',
    extensionExplain: '60 ÷ 4 = 15, so 25% of 60 is 15.', model: 'percent',
  },
  {
    id: 'metric-convert', name: 'The measuring bridge', strand: 'Measurement', reviewYear: 5,
    objective: 'Convert metres to centimetres.',
    known: '1 metre = 100 centimetres.', find: 'How many centimetres are in 2.5 metres?',
    question: 'Two whole metres are 200 cm. Half a metre is 50 cm.', prompt: '2.5 m = ? cm', answer: '250',
    acceptedAnswers: ['250','250cm'], hint: 'Split 2.5 m into 2 m and 0.5 m, then convert each part.',
    language: '“Convert” means change the unit without changing the actual length.',
    explain: '2 m = 200 cm and 0.5 m = 50 cm. Altogether, 2.5 m = 250 cm.',
    extension: '3.2 m = ? cm', extensionAnswer: '320',
    extensionExplain: 'Multiply metres by 100: 3.2 × 100 = 320 cm.', model: 'measure',
  },
  {
    id: 'triangle-angles', name: 'The geometry compass', strand: 'Geometry', reviewYear: 5,
    objective: 'Find a missing angle in a triangle.',
    known: 'Angles inside a triangle total 180°. Two angles are 55° and 65°.',
    find: 'What is the missing angle?',
    question: 'Add the known angles, then subtract their total from 180°.', prompt: 'Missing angle = ?°', answer: '60',
    acceptedAnswers: ['60','60°'], hint: '55 + 65 = 120. Now find the difference between 120 and 180.',
    language: '“Angles in a triangle total 180°” means all three inside angles add up to 180°.',
    explain: '55° + 65° = 120°. Then 180° − 120° = 60°.',
    extension: 'A triangle has angles of 35° and 75°. Find the third angle.', extensionAnswer: '70',
    extensionExplain: '35° + 75° = 110°. Then 180° − 110° = 70°.', model: 'triangle',
  },
];
export const skills = [
  ...words.map((w) => ({
    id: w.id,
    subject: 'English',
    stage: 'Cross-year vocabulary support',
    objective: w.definition,
    prerequisites: [],
    difficulty: 1,
    vocabulary: [w.label],
    mission: 'trophy',
    source: 'Supplementary story vocabulary',
  })),
  {
    id: 'sentence',
    subject: 'English',
    stage: 'Year 2 foundation → Years 5–6 application',
    objective: 'Use because to explain a feeling with a complete sentence.',
    prerequisites: ['puzzled', 'relieved'],
    difficulty: 2,
    vocabulary: ['because', 'felt'],
    mission: 'trophy',
    source: 'Teacher-designed application of composition and subordination',
  },
  ...puzzles.map((p) => ({
    id: p.id,
    subject: 'Mathematics',
    stage: `Year ${p.reviewYear} review → Year 6 readiness`,
    objective: p.objective,
    prerequisites: ['read the known information', 'identify what to find'],
    difficulty: p.reviewYear >= 5 ? 2 : 1,
    vocabulary: [p.strand, 'known', 'find'],
    mission: p.id,
    source: 'DfE mathematics programme: Year 6',
  })),
];
export interface LessonPackage {
  version: 1;
  id: string;
  title: string;
  subject: string;
  objective: string;
  year: number;
  vocabulary: { word: string; definition: string }[];
  question: string;
  choices: string[];
  answer: number;
  hint: string;
}
export function validateLesson(v: unknown): v is LessonPackage {
  const x = v as LessonPackage;
  return (
    !!x &&
    x.version === 1 &&
    typeof x.id === 'string' &&
    /^[a-z][a-z0-9-]{2,50}$/.test(x.id) &&
    ['title', 'subject', 'objective', 'question', 'hint'].every(
      (k) =>
        typeof (x as any)[k] === 'string' &&
        (x as any)[k].length > 0 &&
        (x as any)[k].length < 1000,
    ) &&
    Number.isInteger(x.year) &&
    x.year >= 1 &&
    x.year <= 6 &&
    Array.isArray(x.vocabulary) &&
    x.vocabulary.length <= 12 &&
    x.vocabulary.every(
      (w) =>
        typeof w.word === 'string' &&
        w.word.length < 60 &&
        typeof w.definition === 'string' &&
        w.definition.length < 400,
    ) &&
    Array.isArray(x.choices) &&
    x.choices.length >= 2 &&
    x.choices.length <= 6 &&
    x.choices.every((c) => typeof c === 'string' && c.length < 300) &&
    Number.isInteger(x.answer) &&
    x.answer >= 0 &&
    x.answer < x.choices.length
  );
}

export function starterPuzzles(year: number) {
  if (year >= 6) return puzzles;
  return puzzles.slice(0, 3).map((p) => ({...p,id:`y4-${p.id}`}));
}
