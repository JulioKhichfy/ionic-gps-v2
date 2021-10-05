import { Component, OnDestroy, OnInit } from '@angular/core';
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
 
  constructor(public locationService:LocationService) {
    this.locations = [];
  }

  ngOnInit(): void {
    this.locationService.lastLocationSubject.subscribe((signal:SignalModel)=>{
      if(signal != null) {
        this.signal = new SignalModel(signal.latitude, signal.longitude);
      }
    })
  }

  ngOnDestroy(): void {
    
  }

  startForegroundTracking(){
    this.locationService.currentPosition();
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