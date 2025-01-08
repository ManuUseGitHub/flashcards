export const enum Flavours {
  RANDOM = 'random', // Random
  NOUNS_ONLY = 'nounsOnly', // The [x] of [y]
  ADJ_NOUN = 'adjNoun', // The [x][y]
  THREE_NOUNS = 'threeNouns', // The [x] of [y] and [z]
  TWO_NOUNS = 'twoNouns', // The [x] and the [y]
  LEFT_ADJ = 'leftAdj', //The [x][y] of the [z]
  RIGHT_ADJ = 'rightAdj', // The [x] of [y][z]
  BOTH_ADJ = 'bothAdj', // The [w][x] of the [y][z]
}

export const flavours = [
  Flavours.RANDOM,
  Flavours.NOUNS_ONLY,
  Flavours.ADJ_NOUN,
  Flavours.THREE_NOUNS,
  Flavours.TWO_NOUNS,
  Flavours.LEFT_ADJ,
  Flavours.RIGHT_ADJ,
  Flavours.BOTH_ADJ,
];
