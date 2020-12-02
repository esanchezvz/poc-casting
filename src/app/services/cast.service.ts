import { Injectable } from '@angular/core';

declare const chrome: any;

@Injectable({
  providedIn: 'root',
})
export class CastService {
  videoId: string;
  provider: string;
  startSeconds: number;
  receiverId = '11CC3BE6';
  namespace = 'urn:x-cast:dev.esanchezvz.custom-cast-test';
  castEnabled = false;
  isCasting = false;
  castSession: any;
  receiverAvailable: boolean = false;
  receiverPlayerState: string | null = null;

  constructor() {}

  setParams({  videoId, startSeconds, provider  }: Params) {
    this.videoId = videoId;
    this.startSeconds = startSeconds;
    this.provider = provider;
  }

  getCast() {
    return chrome.cast;
  }

  initCast() {
    const apiConfig = new chrome.cast.ApiConfig(
      new chrome.cast.SessionRequest(this.receiverId),
      (session: any) => {
        this.castSession = session;
        console.log(this.castSession);
        if (localStorage.getItem('receiverPlayerState')) {
          this.receiverPlayerState = localStorage.getItem('receiverPlayerState');
        }
        if (this.castSession.status === 'connected') this.isCasting = true;
      },
      (receiverAvailable: 'available' | 'unavailable') => {
        if (receiverAvailable === 'available') this.receiverAvailable = true;
        else this.receiverAvailable = false;

        if (this.castSession && !this.receiverAvailable) this.stopSession();
        console.log({ receiverAvailable });
      }
    );

    if (!this.isCasting) {
      chrome.cast.initialize(
        apiConfig,
        () => {
          this.castEnabled = true;
        },
        (err: any) => {
          alert(JSON.stringify(err, null, 2));
        }
      );
    }
  }

  requestSession(callback: Function) {
    // TODO Refactor callback into a cast status observer to subscribe on player
    chrome.cast.requestSession(
      (session: any) => {
        console.log(session);
        this.castSession = session;
        this.loadVideo();
        callback();
      },
      (err: any) => {
        callback();
        console.log(err);

        if (this.castSession && this.castSession.status === 'connected') return;

        this.castSession = null;
        this.isCasting = false;
        localStorage.removeItem('receiverPlayerState');
      }
    );
  }

  stopSession() {
    this.isCasting = false;
    this.castSession.stop(
      () => {
        this.castSession = null;
        localStorage.removeItem('receiverPlayerState');
      },
      (err: any) => {
        alert(JSON.stringify(err, null, 2));
      }
    );
  }

  sendMessage(data: any) {
    this.castSession.sendMessage(this.namespace, data);
  }

  private loadVideo() {
    this.castSession.sendMessage(this.namespace, {
      command: 'INIT_COMMUNICATION',
      videoId: this.videoId,
      // TODO - Get seconds from player to init video (Dont do it if its live stream)
      startSeconds: 0,
      provider: this.provider
    });
    this.isCasting = true;
  }

  updateReceiverPlayerState(state: string) {
    this.receiverPlayerState = state;
    localStorage.setItem('receiverPlayerState', state);
  }
}

interface Params {
  videoId: string;
  startSeconds: number;
  provider: string
};
