import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public videoId = 'z6EchXyieos';
  public provider: 'youtube' | 'vimeo' = 'youtube';

  constructor() {}
}
