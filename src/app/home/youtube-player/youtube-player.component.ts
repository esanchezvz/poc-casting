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

  constructor(public renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-provider', 'youtube');
    this.renderer.setAttribute(this.player.nativeElement, 'data-plyr-embed-id', this.src);

    const player = new Plyr(this.player.nativeElement);

    player.on('ready', (event) => {
      this.loading = false;
    });
  }
}
