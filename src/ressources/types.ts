export type CardEntry = {
  dutch: string;
  french: string;
  type?: string;
  id: string;
  part?: string;
  chapter: string;
  tags: string[];
  theme: string;
  issuer: string;
  date: Date;
  difficulty: number;
  article: string;
  file: string;
};

export type CardAddition = {
  global: {
    file: string;
  };
  rows: CardEntry[];
};

export type FormRowtype = {
  actions: boolean;
  id: string;
  tags: string;
  type: string;
  date: string;
  difficulty: number;
  article: string;
  dutch: string;
  french: string;
  theme: string;
  issuer: string;
  chapter: string;
  part: string;
};

export type Filter = {
  files: { value?: string[]; tooltypeText: string };

  // Pick what langage you want to start with
  fromTo: { value?: string; tooltypeText: string };

  // This is the value used by our RNG to give you specific run. the rest will depend on your lists of cards...
  seed: { value?: string; tooltypeText: string };

  // This allows you to pick a specific grammar grain like infinitive/ irregular verb, well, pure grammar point
  type: { value?: string; tooltypeText: string };

  // This is a simple search upon either language source words / expression or target language
  containing: { value?: string; tooltypeText: string };

  // The theme is like travel, housing, work, greetings, politness etc.
  themes: { value?: []; tooltypeText: string };

  // If you created your cards following a specific cursus structure, this will help you staying focus one the block of knowledge you really are interested in
  parts: { value: string[]; tooltypeText: string };

  // This one is also highly cursus centric may the gods of structure be your companion !
  chapters: { value: string[]; tooltypeText: string };

  // echoing the themes, here are subtle categories you set up yourseves to have a fine tune study hopefully
  tags: { value: string[]; tooltypeText: string };

  // the difficulty is a number bellow, y or between x and y or over x
  difficultyStyle: {
    value: 'BELLOW' | 'BETWEEN' | 'OVER';
    tooltypeText: string;
  };

  difficulty: { value: number; tooltypeText: string };
};

export type EffectiveFilters = {
  files: string[];
  fromTo?: string;
  seed?: string;
  type?: string;
  containing?: string;
  themes: string[];
  article: string;
  parts: string[];
  chapters: string[];
  tags: string[];
  difficultyStyle: string;
  difficultyLow: string;
  difficultyHigh: string;
};

export type RegisterUser = {
  username: string;
  passwordhash : string;
  token: string;
  birthdate: Date;
};

export type User = {
  useruuid: string;
  username: string;
  token: string;
  birthdate: Date;
  role: string;
  verified: boolean;
  sessionExpire: Date;
};
