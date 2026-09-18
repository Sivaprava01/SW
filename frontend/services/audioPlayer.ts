/**
 * Sakhi Robust Cross-Platform Audio Player (Expo SDK 57 & Web Compatible).
 * Supports Bundled Local MP3 Assets, Remote URLs, and Base64 Audio with real-time status tracking.
 */

import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer as ExpoAudioPlayer } from 'expo-audio';

export type AudioPlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface AudioPlaybackEvent {
  state: AudioPlayerState;
  currentId: string | null;
  error?: string | null;
  duration?: number;
  currentTime?: number;
}

type AudioListener = (event: AudioPlaybackEvent) => void;

class AudioPlayerService {
  private currentPlayer: ExpoAudioPlayer | null = null;
  private htmlAudioElement: HTMLAudioElement | null = null;
  private currentId: string | null = null;
  private state: AudioPlayerState = 'idle';
  private listeners: Set<AudioListener> = new Set();
  private lastError: string | null = null;
  private audioModeInitialized = false;

  constructor() {
    this.initAudioMode();
  }

  private async initAudioMode() {
    if (this.audioModeInitialized) return;
    try {
      if (Platform.OS !== 'web') {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: 'doNotMix',
        });
      }
      this.audioModeInitialized = true;
      if (__DEV__) console.log('[AudioPlayer] Audio mode initialized (playsInSilentMode=true, interruptionMode=doNotMix)');
    } catch (e) {
      if (__DEV__) console.warn('[AudioPlayer] Failed to set audio mode:', e);
    }
  }

  private setState(state: AudioPlayerState, error: string | null = null) {
    this.state = state;
    this.lastError = error;
    this.notify();
  }

  private notify() {
    const event: AudioPlaybackEvent = {
      state: this.state,
      currentId: this.currentId,
      error: this.lastError,
    };
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        if (__DEV__) console.error('[AudioPlayer] Listener error:', e);
      }
    });
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    // Emit current state immediately to new subscriber
    listener({
      state: this.state,
      currentId: this.currentId,
      error: this.lastError,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioPlayerState {
    return this.state;
  }

  public getCurrentId(): string | null {
    return this.currentId;
  }

  public isPlaying(id?: string): boolean {
    if (id) {
      return this.state === 'playing' && this.currentId === id;
    }
    return this.state === 'playing';
  }

  public isLoading(id?: string): boolean {
    if (id) {
      return this.state === 'loading' && this.currentId === id;
    }
    return this.state === 'loading';
  }

  public stop() {
    if (__DEV__) console.log(`[AudioPlayer] Stopping audio (currentId=${this.currentId})`);

    // Stop Native / Expo Audio Player
    if (this.currentPlayer) {
      try {
        this.currentPlayer.pause();
        this.currentPlayer.remove();
      } catch (e) {
        if (__DEV__) console.warn('[AudioPlayer] Error cleaning up ExpoAudioPlayer:', e);
      }
      this.currentPlayer = null;
    }

    // Stop Web HTML Audio Element
    if (this.htmlAudioElement) {
      try {
        this.htmlAudioElement.pause();
        this.htmlAudioElement.currentTime = 0;
        this.htmlAudioElement.removeAttribute('src');
      } catch (e) {
        if (__DEV__) console.warn('[AudioPlayer] Error cleaning up HTMLAudioElement:', e);
      }
      this.htmlAudioElement = null;
    }

    this.currentId = null;
    this.setState('idle');
  }

  /**
   * Play from a bundled local MP3 asset (e.g. require('@/assets/audio/landing-en.mp3'))
   */
  public async playAsset(source: any, id: string = 'default'): Promise<void> {
    if (__DEV__) {
      console.log(`[LandingVoice] playAsset called for id="${id}", source type=${typeof source}`);
      console.log(`[LandingVoice] platform=${Platform.OS}`);
    }
    this.stop();
    this.currentId = id;
    this.setState('loading');

    try {
      await this.initAudioMode();

      // Resolve Expo Asset
      let resolvedUri = '';
      if (typeof source === 'string') {
        resolvedUri = source;
      } else if (typeof source === 'number' || (source && typeof source === 'object')) {
        if (__DEV__) console.log(`[LandingVoice] asset module=${JSON.stringify(source)}`);
        const asset = Asset.fromModule(source);
        if (__DEV__) {
          console.log(`[LandingVoice] asset name=${asset.name || 'landing-audio'}, initial downloaded=${asset.downloaded}`);
        }
        if (!asset.downloaded) {
          if (__DEV__) console.log('[LandingVoice] downloading asset to local filesystem...');
          await asset.downloadAsync();
        }
        if (__DEV__) {
          console.log(`[LandingVoice] downloaded=${asset.downloaded}`);
          console.log(`[LandingVoice] localUri=${asset.localUri}`);
          console.log(`[LandingVoice] uri=${asset.uri}`);
        }
        // On Native (Android/iOS), use localUri to guarantee 100% offline file playback
        resolvedUri = (Platform.OS !== 'web' && asset.localUri) ? asset.localUri : (asset.localUri || asset.uri || '');
      }

      if (!resolvedUri) {
        throw new Error(`Unable to resolve URI for asset source: ${JSON.stringify(source)}`);
      }

      await this.playUriDirect(resolvedUri, id, source);
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (__DEV__) console.error(`[LandingVoice] ERROR in playAsset: ${errMsg}`, err);
      this.setState('error', errMsg);
      throw err;
    }
  }

  /**
   * Internal playback dispatcher for URI / Asset
   */
  private async playUriDirect(uri: string, id: string, rawSource?: any): Promise<void> {
    if (__DEV__) console.log(`[LandingVoice] starting playback on platform=${Platform.OS} for uri: ${uri}`);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Use browser HTMLAudioElement with user-gesture safety on Web
      const audio = new window.Audio(uri);
      this.htmlAudioElement = audio;
      audio.volume = 1.0;
      audio.muted = false;

      audio.onplay = () => {
        if (__DEV__) console.log('[LandingVoice] isPlaying=true (HTMLAudio onplay)');
        this.setState('playing');
      };

      audio.onended = () => {
        if (__DEV__) console.log('[LandingVoice] playback ended normally');
        this.currentId = null;
        this.setState('idle');
      };

      audio.onerror = (e) => {
        const err = audio.error?.message || 'HTMLAudio error';
        if (__DEV__) console.error('[LandingVoice] ERROR: HTMLAudio playback error', err, e);
        this.setState('error', err);
      };

      if (__DEV__) console.log('[LandingVoice] calling audio.play()...');
      await audio.play();
      if (__DEV__) console.log('[LandingVoice] audio.play() promise resolved');
      this.setState('playing');
    } else {
      // Native Android / iOS using expo-audio SDK 57
      if (__DEV__) {
        console.log(`[LandingVoice] platform=${Platform.OS}`);
        console.log(`[LandingVoice] creating native audio player for uri=${uri}`);
      }

      const sourceObj = { uri };
      const player = createAudioPlayer(sourceObj);
      this.currentPlayer = player;
      player.volume = 1.0;
      player.muted = false;
      if (__DEV__) console.log('[LandingVoice] player created');

      player.addListener('playbackStatusUpdate', (status) => {
        if (__DEV__) {
          console.log(
            `[LandingVoice] playback status: isLoaded=${status.isLoaded}, playing=${status.playing}, didJustFinish=${status.didJustFinish}, duration=${status.duration}, currentTime=${status.currentTime}`
          );
        }

        if (status.error) {
          if (__DEV__) console.error(`[LandingVoice] ERROR: Native player status error: ${status.error}`);
          this.setState('error', status.error);
          return;
        }

        if (status.isLoaded) {
          if (__DEV__ && !status.playing && status.currentTime === 0) {
            console.log(`[LandingVoice] loaded=true, duration=${status.duration}`);
          }

          if (status.playing) {
            if (__DEV__) console.log('[LandingVoice] playing=true');
            this.setState('playing');
          }

          if (status.didJustFinish) {
            if (__DEV__) console.log('[LandingVoice] playback finished naturally (didJustFinish=true)');
            this.currentId = null;
            this.setState('idle');
          }
        }
      });

      if (__DEV__) console.log('[LandingVoice] calling player.play()...');
      player.play();
    }
  }

  /**
   * Play directly from a remote audio URL
   */
  public async playUrl(url: string, id: string = 'default'): Promise<void> {
    if (__DEV__) console.log(`[LandingVoice] playUrl called: ${url} (id=${id})`);
    this.stop();
    this.currentId = id;
    this.setState('loading');
    await this.playUriDirect(url, id);
  }

  /**
   * Play from Base64 audio string (MP3 / WAV) for backend TTS features
   */
  public async playBase64(
    base64Data: string,
    format: string = 'mp3',
    id: string = 'default'
  ): Promise<void> {
    this.stop();
    this.currentId = id;
    this.setState('loading');

    const mime = format === 'wav' ? 'audio/wav' : 'audio/mpeg';
    let cleanBase64 = base64Data.trim();
    if (cleanBase64.startsWith('data:')) {
      cleanBase64 = cleanBase64.split(',')[1] || cleanBase64;
    }
    cleanBase64 = cleanBase64.replace(/[\r\n\s]+/g, '');

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      await this.playUriDirect(blobUrl, id);
    } else {
      const dataUri = `data:${mime};base64,${cleanBase64}`;
      await this.playUriDirect(dataUri, id);
    }
  }
}

export const audioPlayer = new AudioPlayerService();
export default audioPlayer;
