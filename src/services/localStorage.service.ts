import { LocalStorageData } from '../types/interfaces';

export class StorageService {
  private static storageKey: string = 'RSS_Puzzle_YKaruk';

  public static saveData(data: LocalStorageData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  public static getData(): LocalStorageData | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
}
