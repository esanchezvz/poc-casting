import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YoutubePageRoutingModule } from './youtube-routing.module';

import { YoutubePage } from './youtube.page';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, YoutubePageRoutingModule],
  declarations: [YoutubePage, VideoPlayerComponent],
})
export class YoutubePageModule {}
