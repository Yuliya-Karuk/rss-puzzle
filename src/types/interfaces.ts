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
