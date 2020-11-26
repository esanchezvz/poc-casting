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
  castPlaying: false;

  constructor(public renderer: Renderer2, public castService: CastService) {}

  ngOnInit() {
    this.castService.setParams({ videoId: this.src, startSeconds: 0 });
    document.addEventListener('deviceready', () => {
      this.castService.initCast();
    });

    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-provider', 'youtube');
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-embed-id', this.src);

    const player = new Plyr(this.player.nativeElement, {
      controls: () => playerControls,
    });

    // Initialize player + casting config
    player.on('ready', (event) => {
      this.loading = false;
      this.castButton = <HTMLButtonElement>document.getElementById('castButton');
      if (this.castService.isCasting) {
        setTimeout(() => {
          this.castButton.innerHTML = castConnectedIcon;
          this.castButton.blur();
        }, 0);
      }

      this.castButton.addEventListener('click', (e) => {
        this.castService.requestSession(() => {
          this.castButton.blur(); // Loose focus to update casting button 

          // FIXME - not updating icon when stopping session
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

    
    player.on('volumechange', (event) => {
      if (this.castService.isCasting && event.detail.plyr.muted) {
        console.log('Should mute cast video!')
        this.castService.sendMessage({command: 'MUTE_VIDEO'});
      } else if(this.castService.isCasting && !event.detail.plyr.muted) {
        console.log('Should un-mute cast video!')
        this.castService.sendMessage({command: 'UNMUTE_VIDEO'});
      }
    });
  }

  toggleCastActive() {
    this.castService.castEnabled
      ? this.castButton.classList.add('active')
      : this.castButton.classList.remove('active');
  }
}
