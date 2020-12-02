import {
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { playerControls, castIcon } from './constants';
import * as Plyr from 'plyr';
import { CastService } from '../../services/cast.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, DoCheck {
  @Input() src: string;
  @Input() provider: string;
  @ViewChild('player', { static: true }) player: ElementRef;
  loading: boolean = true;
  castButton: HTMLButtonElement;
  isCasting: boolean;
  receiverMuted: boolean;

  constructor(public renderer: Renderer2, public castService: CastService) {}

  ngOnInit() {
    this.castService.setParams({ videoId: this.src, startSeconds: 0, provider: this.provider });
    document.addEventListener('deviceready', () => {
      this.castService.initCast();
      this.isCasting = this.castService.isCasting;
    });

    this.renderer.setAttribute(
      this.player.nativeElement,
      'data-plyr-provider',
      this.provider
    );
    this.renderer.setAttribute(
      this.player.nativeElement,
      'data-plyr-embed-id',
      this.src
    );

    const player = new Plyr(this.player.nativeElement, {
      controls: () => playerControls,
    });

    // Initialize player + casting config
    player.on('ready', (event) => {
      this.loading = false;
      this.castButton = <HTMLButtonElement>(
        document.getElementById('castButton')
      );
      const controls = document.querySelectorAll('.plyr__controls');

      if (this.castService.isCasting) {
        setTimeout(() => {
          this.receiverMuted = this.castService.castSession.receiver.volume.muted;
          this.castService.updateReceiverPlayerState('playing');
          localStorage.setItem('receiverPlayerState', 'playing');
          controls.forEach(item => {
            item.classList.add('hide');
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.receiverMuted = false;
          controls.forEach(item => {
            item.classList.remove('hide');
          });
        }, 0);
      }

      this.castButton.addEventListener('click', (e) => {
        this.castService.requestSession(() => {
          this.castButton.blur();
        });
      });

      if (this.castService.castEnabled && this.castService.receiverAvailable) {
        this.castButton.classList.remove('disabled');
        this.castButton.innerHTML = castIcon;
      } else {
        this.castButton.classList.add('disabled');
      }
    });
  }

  ngDoCheck() {
    if (this.isCasting !== this.castService.isCasting) {
      this.isCasting = this.castService.isCasting;
      const controls = document.querySelectorAll('.plyr__controls');
      
      if (controls && this.castService.isCasting) {
        // console.log('controls should be hidden');
        controls.forEach(item => {
          item.classList.add('hide');
        });
      } else if (controls && !this.castService.isCasting) {
        // console.log('controls should be visible');
        controls.forEach(item => {
          item.classList.remove('hide');
        });
      }
    }
  }

  stopSession() {
    if (confirm('¿Seguro que deseas salir de cast?')) {
      this.castService.stopSession();
    }
  }

  toggleMuteReceiver() {
    const isMuted: boolean = this.castService.castSession.receiver.volume.muted;

    this.receiverMuted = !isMuted;

    this.castService.castSession.setReceiverMuted(
      isMuted ? false : true,
      () => {
        // console.log( this.receiverMuted ? 'Receiver muted' : 'Receiver unmuted')
        // console.log({receiverMuted: this.receiverMuted, });
      },
      (err: any) => {
        console.error(err)
      }
    )
  }

  toggleReceiverPlay() {
    if (this.castService.receiverPlayerState === 'paused') {
      this.castService.updateReceiverPlayerState('playing');
      this.castService.sendMessage({command: 'PLAY_VIDEO'});
    } else if (this.castService.receiverPlayerState === 'playing') {
      this.castService.updateReceiverPlayerState('paused');
      this.castService.sendMessage({command: 'PAUSE_VIDEO'});
    } else if (!this.castService.receiverPlayerState && this.castService.isCasting) {
      this.castService.updateReceiverPlayerState('paused');
      this.castService.sendMessage({command: 'PAUSE_VIDEO'});
    }
  }
}
