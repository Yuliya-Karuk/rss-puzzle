import { type Word } from '../components/word/word';
import { DomElementAttribute, DomElementProperties } from '../types/interfaces';
import { Level } from '../types/types';

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

export function shuffleWords(words: Word[]): Word[] {
  const cloneWords = Object.assign([], words);
  return cloneWords.sort(() => Math.random() - 0.5);
}

export function collectSentence(arr: Word[]): string {
  const sentence = arr.reduce((acc, el) => `${acc} ${el.value}`, '');
  return sentence.trim();
}

export function checkEventTarget(value: EventTarget | null): HTMLElement {
  if (value instanceof HTMLElement) {
    return value;
  }
  throw new Error(`Not expected value`);
}

interface ConstructorOf<T> {
  new (...args: readonly never[]): T;
}

export function getDOMElement<T extends Node>(
  elemType: ConstructorOf<T>,
  element: Element | Document | DocumentFragment
): T {
  if (!(element instanceof elemType)) {
    throw new Error(`Not expected value: ${element} of type:${elemType}`);
  }
  return element;
}

export function checkLevel(level: number): Level {
  if (level >= 1 && level <= 6) {
    return level as Level;
  }
  return 1 as Level;
}
