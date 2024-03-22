import { Placeholder } from '../components/placeholder/placeholder';
import { Word } from '../components/word/word';

export function isWord(wordValue: Word | Placeholder): wordValue is Word {
  return wordValue instanceof Word;
}
