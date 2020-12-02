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
  receiverAvailable: boolean = false;

  constructor() {}

  setParams({
    videoId,
    startSeconds,
  }: {
    videoId: string;
    startSeconds: number;
  }) {
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
        this.castSession = session;
        if (this.castSession.status === 'connected') this.isCasting = true;
      },
      (receiverAvailable: 'available' | 'unavailable') => {
        if (receiverAvailable === 'available') this.receiverAvailable = true;
        else this.receiverAvailable = false;

        if (this.castSession && !this.receiverAvailable) this.stopSession();
        console.log({  receiverAvailable  });
      }
    );

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

  requestSession(callback: Function) {
    // TODO Refactor callback into a cast status observer to subscribe on player
    chrome.cast.requestSession(
      (session: any) => {
        console.log(session);
        this.castSession = session;
        this.loadYoutubeVideo();
        callback();
      },
      (err: any) => {
        callback();
        console.log(err);

        if (this.castSession && this.castSession.status === 'connected') return;

        this.castSession = null;
        this.isCasting = false;
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

  sendMessage(data: any) {
    this.castSession.sendMessage(this.namespace, data);
  }

  private loadYoutubeVideo() {
    this.castSession.sendMessage(this.namespace, {
      command: 'INIT_COMMUNICATION',
      videoId: this.videoId,
      // TODO - Get seconds from player to init video (Dont do it if its live stream)
      startSeconds: 0,
    });
    this.isCasting = true;
  }

  scanForRoutes() {
    chrome.cast.cordova.scanForRoutes(
      (routes: any) => {
        console.log(routes);
      },
      (err: any) => console.error(err)
    );
  }
}
