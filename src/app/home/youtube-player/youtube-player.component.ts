import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import { playerControls, castConnectedIcon, castIcon } from './constants';
import * as Plyr from 'plyr';
import { CastService } from '../services/cast.service';

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
  cast: any;

  constructor(public renderer: Renderer2, public castService: CastService) {}

  ngOnInit() {
    this.castService.setParams({ videoId: this.src, startSeconds: 0 });
    document.addEventListener('deviceready', () => {
      this.castService.initCast();
      this.cast = this.castService.getCast();
    });

    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-provider', 'youtube');
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-embed-id', this.src);

    const player = new Plyr(this.player.nativeElement, {
      controls: () => playerControls,
    });

    player.on('ready', (event) => {
      this.loading = false;
      this.castButton = <HTMLButtonElement>document.getElementById('castButton');
      this.castButton.addEventListener('click', (e) => {
        this.castService.requestSession(() => {
          this.castButton.blur(); // Loose focus to update DOM

          if (this.castService.isCasting) {
            this.castButton.innerHTML = castConnectedIcon;
          } else {
            this.castButton.innerHTML = castIcon;
          }
        });
      });

      if (!this.castService.castEnabled) {
        this.castButton.classList.add('disabled');
      } else {
        this.castButton.classList.remove('disabled');
        this.castButton.innerHTML = castIcon;
      }
    });
  }

  toggleCastActive() {
    this.castService.castEnabled
      ? this.castButton.classList.add('active')
      : this.castButton.classList.remove('active');
  }
}
