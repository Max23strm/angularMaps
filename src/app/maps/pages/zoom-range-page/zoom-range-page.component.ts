import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';
@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map')
  public divMap?:ElementRef;

  public zoom = 5
  public map?: Map;
  public lngLant : LngLat = new LngLat( -86.86963642666257, 21.141626765641618 )
  ngAfterViewInit(): void {

    if(!this.divMap) return

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLant, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      });
      this.mapListeners()
  }

  mapListeners () {
    if(!this.map) throw 'Mapa no inicializado'

    this.map.on('zoom', ( event )=>{
      this.zoom = this.map!.getZoom()
    })

    this.map.on('zoomend',( event )=>{
      if(this.map!.getZoom() < 18) return

      this.map?.zoomTo(18)
    })

    this.map.on('move',()=>{
      this.lngLant = this.map!.getCenter()
    })
  }

  ngOnDestroy(): void {
    this.map?.remove()
  }

  zoomButtons(direction:string) {
    if( !direction ) return

    if(direction === 'in') this.map?.zoomIn()
    if(direction === 'out') this.map?.zoomOut()
  }
  zoomChanged(value:string){
    this.zoom = Number(value)
    this.map?.zoomTo(this.zoom)
  }
}

