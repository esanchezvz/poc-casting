import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.page.html',
  styleUrls: ['./youtube.page.scss'],
})
export class YoutubePage implements OnInit {
  public videoId = 'z6EchXyieos';
  public provider: 'youtube' | 'vimeo' = 'youtube';

  constructor() {}

  ngOnInit() {}
}
