import { Platform, Alert, Linking } from 'react-native';
import { voiceService } from '@/services/voiceService';

export interface SpeechRecorderCallbacks {
  onStart?: () => void;
  onStop?: () => void;
  onTranscribing?: () => void;
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
}

class SpeechRecorderService {
  private isRecordingState = false;
  private mediaRecorder: any = null;
  private audioChunks: any[] = [];
  private currentStream: any = null;
  private nativeRecorder: any = null;

  public isRecording(): boolean {
    return this.isRecordingState;
  }

  public async start(language: string = 'te', callbacks?: SpeechRecorderCallbacks): Promise<void> {
    if (this.isRecordingState) {
      await this.stop(language, callbacks);
      return;
    }

    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
        let stream: any;
        try {
          if (__DEV__) console.log('[SpeechRecorder] Requesting web getUserMedia audio stream...');
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (webPermErr: any) {
          if (__DEV__) console.warn('[SpeechRecorder] Web microphone permission denied:', webPermErr);
          Alert.alert(
            language === 'te' ? 'మైక్రోఫోన్ అనుమతి' : language === 'hi' ? 'माइक्रोफ़ोन अनुमति' : 'Microphone Access',
            language === 'te'
              ? 'దయచేసి మీ బ్రౌజర్ అడ్రస్ బార్‌లో లాక్ (Lock) ఐకాన్ లేదా కెమెరా/మైక్ ఐకాన్ నొక్కి మైక్రోఫోన్ అనుమతించండి.'
              : language === 'hi'
              ? 'कृपया अपने ब्राउज़र एड्रेस बार में लॉक (Lock) आइकन पर टैप करके माइक्रोफ़ोन की अनुमति दें।'
              : 'Please allow microphone access in your browser address bar (lock/mic icon) to speak.'
          );
          callbacks?.onError?.(
            language === 'te'
              ? 'మైక్రోఫోన్ అనుమతి తిరస్కరించబడింది.'
              : language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत।'
              : 'Microphone permission denied.'
          );
          return;
        }
        this.currentStream = stream;

        const mimeType =
          typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : 'audio/ogg';

        const recorder = new MediaRecorder(stream, { mimeType });
        this.audioChunks = [];

        recorder.ondataavailable = (e: any) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };

        recorder.onstop = async () => {
          this.isRecordingState = false;
          callbacks?.onStop?.();
          callbacks?.onTranscribing?.();

          try {
            const audioBlob = new Blob(this.audioChunks, { type: mimeType });
            if (this.currentStream) {
              this.currentStream.getTracks().forEach((track: any) => track.stop());
              this.currentStream = null;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
              let base64data = (reader.result as string) || '';
              if (base64data.startsWith('data:')) {
                base64data = base64data.split(',')[1] || base64data;
              }
              base64data = base64data.replace(/[\r\n\s]+/g, '');

              const format = mimeType.includes('webm')
                ? 'webm'
                : mimeType.includes('mp4')
                ? 'mp4'
                : 'ogg';

              try {
                if (__DEV__) console.log('[SpeechRecorder] Sending web audio for transcription...');
                const transRes = await voiceService.transcribeSpeech({
                  audio_base64: base64data,
                  language,
                  audio_format: format,
                });

                if (transRes.transcript && transRes.transcript.trim()) {
                  if (__DEV__) console.log('[SpeechRecorder] Web STT transcript:', transRes.transcript.trim());
                  callbacks?.onTranscript?.(transRes.transcript.trim());
                } else {
                  callbacks?.onError?.(
                    language === 'te'
                      ? 'మాట స్పష్టంగా వినపడలేదు. దయచేసి మళ్లీ మాట్లాడండి.'
                      : language === 'hi'
                      ? 'आवाज़ स्पष्ट नहीं सुनाई दी। कृपया पुनः बोलें।'
                      : 'No speech recognized. Please speak clearly.'
                  );
                }
              } catch (err: any) {
                if (__DEV__) console.warn('[SpeechRecorder] Web STT failed:', err);
                callbacks?.onError?.(err?.message || 'Transcription service error');
              }
            };
            reader.readAsDataURL(audioBlob);
          } catch (err: any) {
            callbacks?.onError?.('Audio processing error: ' + err.message);
          }
        };

        recorder.start();
        this.mediaRecorder = recorder;
        this.isRecordingState = true;
        callbacks?.onStart?.();
      } else {
        // Native (Android/iOS) using expo-audio SDK 57
        const {
          AudioModule,
          setAudioModeAsync,
          getRecordingPermissionsAsync,
          requestRecordingPermissionsAsync,
          RecordingPresets,
        } = await import('expo-audio');

        if (__DEV__) console.log('[SpeechRecorder] Checking native recording permissions...');
        let perm = await getRecordingPermissionsAsync();
        if (__DEV__) {
          console.log('[SpeechRecorder] Initial permission status:', perm.status, 'granted:', perm.granted);
        }

        if (!perm.granted) {
          if (__DEV__) console.log('[SpeechRecorder] Requesting runtime permission...');
          perm = await requestRecordingPermissionsAsync();
          if (__DEV__) {
            console.log('[SpeechRecorder] Requested permission status:', perm.status, 'granted:', perm.granted);
          }
        }

        if (!perm.granted) {
          Alert.alert(
            language === 'te' ? 'మైక్రోఫోన్ అనుమతి అవసరం' : language === 'hi' ? 'माइक्रोफ़ोन अनुमति आवश्यक' : 'Microphone Permission Required',
            language === 'te'
              ? 'వాయిస్ ద్వారా మాట్లాడటానికి మీ ఫోన్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతించండి.'
              : language === 'hi'
              ? 'वॉयस इनपुट के लिए कृपया अपने फोन सेटिंग्स में माइक्रोफ़ोन अनुमति दें।'
              : 'Please enable microphone access in your device settings to speak to Sakhi.',
            [
              { text: language === 'te' ? 'రద్దు' : language === 'hi' ? 'रद्द करें' : 'Cancel', style: 'cancel' },
              {
                text: language === 'te' ? 'సెట్టింగ్స్ తెరవండి' : language === 'hi' ? 'सेटिंग्स खोलें' : 'Open Settings',
                onPress: () => Linking.openSettings().catch(() => {}),
              },
            ]
          );

          callbacks?.onError?.(
            language === 'te'
              ? 'మైక్రోఫోన్ అనుమతి తిరస్కరించబడింది. దయచేసి సెట్టింగ్స్‌లో అనుమతించండి.'
              : language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया सेटिंग्स में अनुमति दें।'
              : 'Microphone permission is required. Please allow microphone access in Android settings.'
          );
          return;
        }

        if (__DEV__) console.log('[SpeechRecorder] Configuring audio mode for recording...');
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
          interruptionMode: 'doNotMix',
        });

        if (__DEV__) console.log('[SpeechRecorder] Creating native AudioRecorder instance...');
        const recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
        await recorder.prepareToRecordAsync();
        recorder.record();
        this.nativeRecorder = recorder;
        this.isRecordingState = true;
        if (__DEV__) console.log('[SpeechRecorder] Native recording started successfully');
        callbacks?.onStart?.();
      }
    } catch (err: any) {
      this.isRecordingState = false;
      if (__DEV__) console.error('[SpeechRecorder] Start error:', err);

      const isPermError =
        err?.message?.toLowerCase().includes('permission') || err?.code === 'E_NO_PERMISSIONS';

      if (isPermError) {
        callbacks?.onError?.(
          language === 'te'
            ? 'మైక్రోఫోన్ అనుమతి అవసరం. దయచేసి సెట్టింగ్స్‌లో అనుమతించండి.'
            : language === 'hi'
            ? 'माइक्रोफ़ोन अनुमति आवश्यक है। कृपया सेटिंग्स में अनुमति दें।'
            : 'Microphone permission is required. Please allow microphone access in Android settings.'
        );
      } else {
        callbacks?.onError?.(
          language === 'te'
            ? 'మైక్రోఫోన్ ప్రారంభించలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.'
            : language === 'hi'
            ? 'माइक्रोफ़ोन शुरू नहीं हो सका। कृपया पुनः प्रयास करें।'
            : 'Unable to start the microphone. Please try again.'
        );
      }
    }
  }

  public async stop(language: string = 'te', callbacks?: SpeechRecorderCallbacks): Promise<void> {
    if (!this.isRecordingState) return;

    if (Platform.OS === 'web') {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      } else {
        this.isRecordingState = false;
        callbacks?.onStop?.();
      }
    } else {
      // Native stop
      this.isRecordingState = false;
      callbacks?.onStop?.();
      callbacks?.onTranscribing?.();

      if (this.nativeRecorder) {
        try {
          const recorder = this.nativeRecorder;
          this.nativeRecorder = null;

          if (__DEV__) console.log('[SpeechRecorder] Stopping native recorder...');
          await recorder.stop();
          const uri = recorder.uri;
          if (__DEV__) console.log('[SpeechRecorder] Recording stopped. Output URI:', uri);

          if (!uri) {
            callbacks?.onError?.(
              language === 'te'
                ? 'ఆడియో రికార్డింగ్ ఫైల్ లభించలేదు.'
                : language === 'hi'
                ? 'ऑडियो रिकॉर्डिंग फ़ाइल नहीं मिली।'
                : 'Recording file unavailable.'
            );
            return;
          }

          // Read URI as blob -> base64
          const response = await fetch(uri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = async () => {
            let base64data = (reader.result as string) || '';
            if (base64data.startsWith('data:')) {
              base64data = base64data.split(',')[1] || base64data;
            }
            base64data = base64data.replace(/[\r\n\s]+/g, '');

            if (!base64data) {
              callbacks?.onError?.(
                language === 'te'
                  ? 'ఆడియో డేటా ఖాళీగా ఉంది.'
                  : language === 'hi'
                  ? 'ऑडियो डेटा खाली है।'
                  : 'Recorded audio data is empty.'
              );
              return;
            }

            try {
              if (__DEV__) {
                console.log('[SpeechRecorder] Sending audio for transcription, base64 length:', base64data.length);
              }
              const transRes = await voiceService.transcribeSpeech({
                audio_base64: base64data,
                language,
                audio_format: 'm4a',
              });

              if (transRes.transcript && transRes.transcript.trim()) {
                if (__DEV__) {
                  console.log('[SpeechRecorder] Native STT transcript:', transRes.transcript.trim());
                }
                callbacks?.onTranscript?.(transRes.transcript.trim());
              } else {
                callbacks?.onError?.(
                  language === 'te'
                    ? 'మాట స్పష్టంగా వినపడలేదు. దయచేసి మళ్లీ మాట్లాడండి.'
                    : language === 'hi'
                    ? 'आवाज़ स्पष्ट नहीं सुनाई दी। कृपया पुनः बोलें।'
                    : 'No speech recognized. Please speak clearly.'
                );
              }
            } catch (err: any) {
              if (__DEV__) console.error('[SpeechRecorder] Native STT failed:', err);
              callbacks?.onError?.(
                language === 'te'
                  ? 'సర్వర్ అనువాదం విఫలమైంది: ' + (err?.message || 'నెట్‌వర్క్ లోపం')
                  : language === 'hi'
                  ? 'ट्रांसक्रिप्शन विफल: ' + (err?.message || 'नेटवर्क त्रुटि')
                  : 'Transcription failed: ' + (err?.message || 'Network error')
              );
            }
          };
          reader.readAsDataURL(blob);
        } catch (err: any) {
          if (__DEV__) console.error('[SpeechRecorder] Native stop error:', err);
          callbacks?.onError?.('Recording stop error: ' + err.message);
        }
      }
    }
  }
}

export const speechRecorder = new SpeechRecorderService();
export default speechRecorder;
