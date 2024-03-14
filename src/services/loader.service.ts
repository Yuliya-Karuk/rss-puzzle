export class LoaderService {
  private static audioLink: string = 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/';
  private static imageLink: string =
    'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/';

  public static async getAudio(source: string, audioContext: AudioContext): Promise<AudioBuffer> {
    try {
      const ctx = audioContext;
      const response = await fetch(`${this.audioLink}${source}`);
      const data = await response.arrayBuffer();
      const arrayBuffer = await ctx.decodeAudioData(data);
      return arrayBuffer;
    } catch (error) {
      throw new Error('Error fetching data:');
    }
  }

  public static async getImage(source: string): Promise<string> {
    try {
      const response = await fetch(`${this.imageLink}${source}`);
      const data = await response.blob();
      const imageUrl = URL.createObjectURL(data);
      return imageUrl;
    } catch (error) {
      throw new Error('Error fetching data:');
    }
  }
}
