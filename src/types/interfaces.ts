export interface Props {
  tag: string;
  className: string;
  text?: string;
  attr?: object;
}

export interface DomElementAttribute {
  [key: string]: string;
}

export interface DomElementProperties {
  [key: string]: string;
}

export interface UserData {
  name: string;
  surname: string;
}

export interface HintsState {
  translationHint: boolean;
  audioHint: boolean;
  imageHint: boolean;
}

export interface GameData {
  userData: UserData;
  hintsState: HintsState;
}

export interface WordCollection {
  rounds: WordSentence[];
  roundsCount: number;
}

export interface WordSentence {
  levelData: LevelData;
  words: WordData[];
}

export interface LevelData {
  id: string;
  name: string;
  imageSrc: string;
  cutSrc: string;
  author: string;
  year: string;
}

export interface WordData {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
}
