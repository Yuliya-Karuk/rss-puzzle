export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type Callback = () => void | Promise<void>;

export type ValidationFunction = (input: HTMLInputElement, inputName?: string) => string;

export type CompletedRoundsData = {
  [key in Level]: number[];
};
