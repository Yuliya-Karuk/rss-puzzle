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

export interface LocalStorageData {
  name: string;
  surname: string;
}

export interface WordCollection {
  rounds: WordSentence[];
  roundsCount: number;
}

export interface WordSentence {
  levelData: {
    id: string;
    name: string;
    imageSrc: string;
    cutSrc: string;
    author: string;
    year: string;
  };
  words: WordData[];
}

export interface WordData {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
}
