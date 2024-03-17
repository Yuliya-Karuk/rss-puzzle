import { HintsState, SavedRound, SavedRoundStats } from '../types/interfaces';
import { CompletedRoundsData } from '../types/types';

export const startPageText: string =
  '<strong>Puzzle English</strong> is a platform for learning English with games and interesting tasks, where you can study at any level, at any time and for any purpose.';

export const startGameRules: string =
  '<b>Game rules:</b><br>🧩 goal: you need to put together a meaningful sentence from several words.<br>🎮 3 types of hints: translating a phrase in Russian, listening to the pronunciation of a sentence, background image puzzle hint (all hints can be turned on and off).<br>🌟 Make all sentences correctly and reveal all the puzzle pieces from the work of art.';

export const SentencesPerRound: number = 10;

export const PaddingMain: number = 10;

export const defaultHintsState: HintsState = {
  translationHint: true,
  audioHint: true,
  imageHint: true,
};

export const LevelsNumber: number = 6;

export const defaultCompletedRounds: CompletedRoundsData = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
};

export const defaultLastRound: SavedRound = {
  level: 1,
  round: 0,
};

export const defaultStats: SavedRoundStats = {
  imageUrl: '',
  imageInfo: '',
  audioContext: null,
  known: [],
  unknown: [],
};
