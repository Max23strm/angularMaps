import { AfterViewInit, Component, ElementRef, Input,ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  @Input() lngLat?: [number, number]

  @ViewChild('divMap') divMap?:ElementRef;

  ngAfterViewInit(){
    if(!this.lngLat) throw 'lgnLat can´t be null'
    if(!this.divMap) throw 'divMap wasn not fount'

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 13, // starting zoom
      interactive: false
      });


      const marker = new Marker({
        // color: "red"
      })
        .setLngLat(this.lngLat)
        .addTo(map)
  }
}
