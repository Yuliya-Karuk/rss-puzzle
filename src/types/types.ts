export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

export type HTMLElementDragEvent<T extends HTMLElement> = DragEvent & {
  target: T;
};
