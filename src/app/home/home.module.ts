import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';

import { CastService } from './services/cast.service';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, YoutubePlayerComponent],
  providers: [CastService],
})
export class HomePageModule {}
