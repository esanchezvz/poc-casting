import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import { playerControls, castConnectedIcon, castIcon } from './constants';
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
  isCastEnabled: boolean = false;
  isCasting: boolean = false;
  castButton: HTMLButtonElement;

  constructor(public renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-provider', 'youtube');
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-embed-id', this.src);

    const player = new Plyr(this.player.nativeElement, {
      controls: () => playerControls,
    });

    player.on('ready', (event) => {
      this.loading = false;
      this.castButton = <HTMLButtonElement>document.getElementById('castButton');
      this.castButton.addEventListener('click', () => this.setCasting());
    });
  }

  setCasting() {
    this.isCasting = !this.isCasting;

    if (this.isCasting) {
      this.castButton.innerHTML = castConnectedIcon;
    } else {
      this.castButton.innerHTML = castIcon;
    }
  }

  toggleCastActive() {
    this.isCastEnabled = !this.isCastEnabled;
    this.isCastEnabled
      ? this.castButton.classList.add('active')
      : this.castButton.classList.remove('active');
  }
}
