import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string,
  marker: Marker
}

interface PlainMarker {
  color:string,
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit {


  @ViewChild('map')
  public divMap?:ElementRef;

  public markers: MarkerAndColor[] = []

  public map?: Map;
  public lngLant : LngLat = new LngLat( -86.86963642666257, 21.141626765641618 )
  ngAfterViewInit(): void {

    if(!this.divMap) return

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLant, // starting position [lng, lat]
      zoom: 13, // starting zoom
      });


      // const marker = new Marker({
      //   // color: "red"
      // })
      //   .setLngLat(this.lngLant)
      //   .addTo(this.map)
      this.readFromLocalStorage()
  }

  createMarker () {
    if(!this.map) return
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lgnLat =this.map!.getCenter()

    this.addMarker(lgnLat, color)
  }

  addMarker (lgnLat :LngLat, color: string){
    if(!this.map) return

    const marker = new Marker ({
      color:color,
      draggable: true
    })
      .setLngLat(lgnLat)
      .addTo(this.map)
    this.markers.push({marker, color})

    this.saveToLocalStorage();

    marker.on('dragend',()=> this.saveToLocalStorage() );

  }

  deleteMarker(index:number){
    this.markers[index].marker.remove()
    this.markers.splice(index,1)
  }

  flyToMarker (marker:Marker){
    this.map?.flyTo({
      zoom:14,
      center: marker.getLngLat()
    })
  }

  saveToLocalStorage () {

    let plainMarkers : PlainMarker[] = this.markers.map(({color, marker})=>{
      return {
        color: color,
        lngLat:marker.getLngLat().toArray()
      }
    })

    localStorage.setItem("markers", JSON.stringify(plainMarkers))
  }

  readFromLocalStorage () {

    const markersString = localStorage.getItem("markers") ?? '[]'
    const markers: PlainMarker[] = JSON.parse(markersString)

    markers.forEach(({color, lngLat})=>{
      let coords= new LngLat(lngLat[0], lngLat[1])

      this.addMarker( coords , color )
    })
  }
}
