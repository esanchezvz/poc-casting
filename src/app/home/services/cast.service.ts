import { Injectable } from '@angular/core';

declare const chrome: any;

@Injectable({
  providedIn: 'root',
})
export class CastService {
  videoId: string;
  startSeconds: number;
  receiverId = '11CC3BE6';
  namespace = 'urn:x-cast:dev.esanchezvz.custom-cast-test';
  castEnabled = false;
  isCasting = false;
  castSession: any;

  constructor() {}

  setParams({ videoId, startSeconds }: { videoId: string; startSeconds: number }) {
    this.videoId = videoId;
    this.startSeconds = startSeconds;
  }

  getCast() {
    return chrome.cast;
  }

  initCast() {
    const apiConfig = new chrome.cast.ApiConfig(
      new chrome.cast.SessionRequest(this.receiverId),
      (session: any) => {
        console.log(session);
      },
      function (receiverAvailable: any) {
        console.log(receiverAvailable);
      }
    );

    chrome.cast.initialize(
      apiConfig,
      () => {
        this.castEnabled = true;
      },
      function (err: any) {
        alert(JSON.stringify(err, null, 2));
      }
    );
  }

  requestSession(callback: Function) {
    // TODO Refactor callback into a cast status observer to subscribe on player
    chrome.cast.requestSession(
      (session: any) => {
        this.castSession = session;
        this.loadYoutubeVideo();
        callback();
        // alert(JSON.stringify(this.castSession));
      },
      (err: any) => {
        this.isCasting = false;
        this.castSession = null;
        callback();

        // if (err.code === 'cancel') return;
        // alert(JSON.stringify(err, null, 2));
      }
    );
  }

  stopSession() {
    this.castSession.stop(
      () => {
        this.isCasting = false;
        this.castSession = null;
      },
      (err: any) => {
        alert(JSON.stringify(err, null, 2));
      }
    );
  }

  private loadYoutubeVideo() {
    this.castSession.sendMessage(this.namespace, {
      command: 'INIT_COMMUNICATION_CONSTANTS',
      videoId: this.videoId,
      startSeconds: 0,
    });
    this.isCasting = true;
  }
}
