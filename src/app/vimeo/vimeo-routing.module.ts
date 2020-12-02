import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VimeoPage } from './vimeo.page';

const routes: Routes = [
  {
    path: '',
    component: VimeoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VimeoPageRoutingModule {}
