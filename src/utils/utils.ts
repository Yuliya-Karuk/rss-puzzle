import { DomElementAttribute, DomElementProperties } from '../types/interfaces';

export function isNotNullable<T>(value: T): NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Not expected value`);
  }
  return value;
}

export function createElementWithProperties<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  elClassName: string,
  attr?: DomElementAttribute,
  props?: DomElementProperties[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = elClassName;
  if (attr) {
    for (let i = 0; i < Object.keys(attr).length; i += 1) {
      const key = Object.keys(attr)[i];
      element.setAttribute(key, attr[key]);
    }
  }
  if (props) {
    Object.assign(element, ...props);
  }
  return element;
}

export function shuffleWords(words: string[]): string[] {
  return words.sort(() => Math.random() - 0.5);
}

export function findPxPerChar(sentence: string[]): number {
  const length = sentence.reduce((acc: number, el: string) => acc + el.length, 0);
  const pxPerChar = Math.floor((window.innerWidth - 80) * 0.9) / length;
  return pxPerChar;
}
