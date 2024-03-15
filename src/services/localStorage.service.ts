import { HintsState, UserData } from '../types/interfaces';
import { isNotNullable } from '../utils/utils';
import { CompletedRoundsData } from '../types/types';

export class StorageService {
  private static storageKey: string = 'RSS_Puzzle_YKaruk';

  public static saveData(userData: UserData, hintsState: HintsState, completedRounds: CompletedRoundsData): void {
    const data = {
      userData,
      hintsState,
      completedRounds,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  public static getUserData(): UserData | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data).userData : null;
  }

  public static getHintsState(): HintsState | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data).hintsState : null;
  }

  public static getCompletedRounds(): CompletedRoundsData | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data).completedRounds : null;
  }

  public static updateHint(hintName: string, isEnabled: boolean): void {
    const data = isNotNullable(localStorage.getItem(this.storageKey));
    const parsedData = JSON.parse(data);
    parsedData.hintsState[hintName] = isEnabled;
    localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
  }

  public static updateCompletedRounds(level: number, round: number): void {
    const data = isNotNullable(localStorage.getItem(this.storageKey));
    const parsedData = JSON.parse(data);
    parsedData.completedRounds[level].push(round);
    localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
  }

  public static removeData(): void {
    localStorage.removeItem(this.storageKey);
  }
}
