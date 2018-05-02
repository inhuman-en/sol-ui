import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { init } from './three-main';

@Component({
  selector: 'sol-spacemap',
  templateUrl: './spacemap.component.html',
  styleUrls: ['./spacemap.component.sass']
})
export class SpacemapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer') mapContainer: ElementRef;

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  startScene() {
    init(this.mapContainer.nativeElement);
  }

}
