import { HintsState } from '../types/interfaces';

export const startPageText: string =
  '<strong>Puzzle English</strong> is a platform for learning English with games and interesting tasks, where you can study at any level, at any time and for any purpose.';

export const startGameRules: string =
  '<b>Game rules:</b><br>🧩 goal: you need to put together a meaningful sentence from several words.<br>🎮 3 types of hints: translating a phrase in Russian, listening to the pronunciation of a sentence, background image puzzle hint (all hints can be turned on and off).<br>🌟 Make all sentences correctly and reveal all the puzzle pieces from the work of art.';

export const SentencesPerRound: number = 10;

export const PaddingMain = 20;

export const defaultHintsState: HintsState = {
  translationHint: true,
  audioHint: true,
  imageHint: true,
};
