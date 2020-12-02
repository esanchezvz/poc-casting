import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vimeo',
  templateUrl: './vimeo.page.html',
  styleUrls: ['./vimeo.page.scss'],
})
export class VimeoPage implements OnInit {
  public videoId = '47612678';
  public provider: 'youtube' | 'vimeo' = 'vimeo';

  constructor() {}

  ngOnInit() {}
}
