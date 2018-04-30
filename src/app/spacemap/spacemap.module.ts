import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpacemapRoutingModule } from './spacemap-routing.module';
import { SpacemapComponent } from './spacemap.component';

@NgModule({
  imports: [
    CommonModule,
    SpacemapRoutingModule
  ],
  declarations: [SpacemapComponent],
  exports: [SpacemapComponent]
})
export class SpacemapModule { }
