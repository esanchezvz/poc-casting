import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import * as Plyr from 'plyr';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
})
export class YoutubePlayerComponent implements OnInit {
  @Input() src: string;
  @ViewChild('player', { static: true }) player: ElementRef;
  loading: boolean = true;
  castButton: HTMLButtonElement;

  controls: string = `
    <button
      type="button"
      class="plyr__control plyr__control--overlaid"
      data-plyr="play"
      aria-label="Play, {title}"
    >
      <svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-play"></use></svg>
      <span class="plyr__sr-only">Play</span>
    </button>
    <div class="plyr__controls">
      <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
      </button>
      <div class="plyr__controls__item plyr__progress__container">
        <div class="plyr__progress">
          <input
            data-plyr="seek"
            type="range"
            min="0"
            max="100"
            step="0.01"
            value="0"
            autocomplete="off"
            role="slider"
            aria-label="Seek"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
            id="plyr-seek-5914"
            aria-valuetext="00:00 of 00:00"
            style="--value: 0%"
          />
          <progress
            class="plyr__progress__buffer"
            min="0"
            max="100"
            value="0"
            role="progressbar"
            aria-hidden="true"
          >
            % buffered
          </progress>
          <span class="plyr__tooltip">00:00</span>
        </div>
      </div>
      <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
      <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
      <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
      </button>
      <button type="button" class="plyr__control" aria-label="Iniciar Cast" id="castButton">
        <svg class="icon--pressed" role="presentation" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0z" fill="none" opacity=".1"/><path d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm18-7H5v1.63c3.96 1.28 7.09 4.41 8.37 8.37H19V7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        <svg class="icon--not-pressed" role="presentation" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0z" fill="none" opacity=".1"/><path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/></svg>
      </button>
      <button type="button" class="plyr__control" data-plyr="fullscreen">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>
      </button>
    </div>
  `;

  constructor(public renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-provider', 'youtube');
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-embed-id', this.src);

    const player = new Plyr(this.player.nativeElement, {
      controls: () => this.controls,
    });

    player.on('ready', (event) => {
      this.loading = false;
      this.castButton = <HTMLButtonElement>document.getElementById('castButton');
      this.castButton.onclick = this.alert;
      console.log(this.castButton);
    });
  }

  alert() {
    alert('Hola mundo!');
  }
}
