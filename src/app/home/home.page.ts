import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { SignalModel } from '../model/signal.model';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy{
  
  locations:any
  public signal:SignalModel;
  latitude:number=0;
  longitude:number=0;

  constructor(public locationService:LocationService) {
    this.locations = [];
  }

  ngOnInit(): void {
    this.locationService.lastLocationSubject.subscribe((signal:SignalModel)=>{
      this.signal = signal;
    })
  }

  ngOnDestroy(): void {
    
  }

  startForegroundTracking(){
    this.locationService.start();
  }

  stopBackgroundTracking(){
    this.locationService.stop();
  }

  /*getLocations(){
    this.locations = (JSON.parse(localStorage.getItem("location")) == null) ? [] : JSON.parse(localStorage.getItem("location"));
  }*/

  /*clearLocations(){
    localStorage.removeItem("location");
  }*/
  
}