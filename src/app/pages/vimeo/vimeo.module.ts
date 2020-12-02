import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VimeoPageRoutingModule } from './vimeo-routing.module';

import { VimeoPage } from './vimeo.page';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VimeoPageRoutingModule],
  declarations: [VimeoPage, VideoPlayerComponent],
})
export class VimeoPageModule {}
