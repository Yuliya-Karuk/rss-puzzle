export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

export type HTMLElementDragEvent<T extends HTMLElement> = DragEvent & {
  target: T;
};

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type Callback = () => void | Promise<void>;

export type CompletedRoundsData = {
  [key in Level]: number[];
};
