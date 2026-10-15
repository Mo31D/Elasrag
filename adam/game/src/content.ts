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
export const puzzles = [
  {
    id: 'fractions',
    name: 'The fraction vault',
    objective: 'Simplify fractions using common factors.',
    question:
      'The vault shows 18/24. Set its lock to the same amount in simplest form.',
    prompt: '18/24 = ?',
    answer: '3/4',
    hint: 'Group 24 pieces into groups of 6. How many groups are coloured?',
    explain: '18 ÷ 6 = 3 and 24 ÷ 6 = 4, so 18/24 = 3/4.',
    extension: '24/32',
    extensionAnswer: '3/4',
    extensionExplain: '24 ÷ 8 = 3 and 32 ÷ 8 = 4, so 24/32 = 3/4.',
    model: 'fraction',
  },
  {
    id: 'ratio',
    name: 'The crystal bridge',
    objective: 'Solve unequal sharing problems using ratio.',
    question:
      'The bridge needs amber and blue crystals in a ratio of 2 : 3. There are 30 crystals altogether. How many should be amber?',
    prompt: 'Amber crystals = ?',
    answer: '12',
    hint: '2 + 3 = 5 equal groups. Share 30 between those 5 groups.',
    explain: '30 ÷ 5 = 6 crystals per part. Amber needs 2 parts: 2 × 6 = 12.',
    extension: 'There are 45 crystals in the same ratio. How many are amber?',
    extensionAnswer: '18',
    extensionExplain: '45 ÷ 5 = 9 per part. Amber has 2 parts, so 2 × 9 = 18.',
    model: 'ratio',
  },
  {
    id: 'algebra',
    name: 'The signal tower',
    objective: 'Use a simple formula and find an unknown.',
    question:
      'A signal machine triples the input and adds 5. Its output is 26. Find the input.',
    prompt: '3 × n + 5 = 26. n = ?',
    answer: '7',
    hint: 'Undo the steps in reverse: subtract 5, then divide by 3.',
    explain: '26 − 5 = 21. Then 21 ÷ 3 = 7. Check: 3 × 7 + 5 = 26.',
    extension: '3 × n + 5 = 41. n = ?',
    extensionAnswer: '12',
    extensionExplain: '41 − 5 = 36, then 36 ÷ 3 = 12. Check: 3 × 12 + 5 = 41.',
    model: 'algebra',
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
    stage: 'Year 6',
    objective: p.objective,
    prerequisites:
      p.id === 'fractions'
        ? ['equivalent fractions', 'common factors']
        : p.id === 'ratio'
          ? ['multiplication', 'division']
          : ['inverse operations'],
    difficulty: 3,
    vocabulary:
      p.id === 'ratio'
        ? ['ratio', 'part', 'altogether']
        : p.id === 'algebra'
          ? ['input', 'output', 'inverse']
          : ['numerator', 'denominator', 'factor'],
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
  return [
    {
      ...puzzles[0],
      id: 'y4-fractions',
      name: 'The fraction vault',
      objective: 'Recognise equivalent fractions.',
      question:
        'Two of four equal pieces are coloured. Which fraction with denominator 2 shows the same amount?',
      prompt: '2/4 = ?',
      answer: '1/2',
      hint: 'Divide both numbers by 2. Two quarters cover half the whole.',
      explain: '2 ÷ 2 = 1 and 4 ÷ 2 = 2, so 2/4 = 1/2.',
      extension: '3/6 = ?',
      extensionAnswer: '1/2',
      extensionExplain: '3 ÷ 3 = 1 and 6 ÷ 3 = 2, so 3/6 = 1/2.',
      model: 'halves',
    },
    {
      ...puzzles[1],
      id: 'y4-sharing',
      name: 'The crystal stores',
      objective: 'Use multiplication and division facts.',
      question:
        'There are 24 crystals. Each box holds 6 crystals. How many boxes are needed?',
      prompt: '24 ÷ 6 = ?',
      answer: '4',
      hint: 'Count in sixes: 6, 12, 18, 24.',
      explain: 'Four groups of 6 make 24. We need 4 boxes.',
      extension: '36 crystals, 6 in each box. How many boxes?',
      extensionAnswer: '6',
      extensionExplain: '6 × 6 = 36, so 36 ÷ 6 = 6.',
      model: 'groups',
    },
    {
      ...puzzles[2],
      id: 'y4-sequence',
      name: 'The pattern tower',
      objective: 'Continue a number sequence.',
      question:
        'The signal gains 4 each time. Continue the pattern: 4, 8, 12, …',
      prompt: '4, 8, 12, ?',
      answer: '16',
      hint: 'Add 4 to 12.',
      explain: 'Each step adds 4, so 12 + 4 = 16.',
      extension: '7, 11, 15, ?',
      extensionAnswer: '19',
      extensionExplain: 'The step is still +4. 15 + 4 = 19.',
      model: 'sequence',
    },
  ];
}
