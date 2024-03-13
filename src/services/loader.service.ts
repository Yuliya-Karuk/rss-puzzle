export class LoaderService {
  // private static audioLink: string = '';

  public static async getAudio(source: string, audioContext: AudioContext): Promise<AudioBuffer> {
    try {
      const ctx = audioContext;
      const response = await fetch(
        `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${source}`
      );
      const data = await response.arrayBuffer();
      const arrayBuffer = await ctx.decodeAudioData(data);
      return arrayBuffer;
    } catch (error) {
      throw new Error('Error fetching data:');
    }
  }
}
