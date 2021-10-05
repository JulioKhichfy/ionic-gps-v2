import { Component } from '@angular/core';
import { BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

import { Platform } from '@ionic/angular';
import { SignalModel } from './model/signal.model';

import { LocationService } from './services/location.service';


const configBG: BackgroundGeolocationConfig = {
  desiredAccuracy: 0,
  stationaryRadius: 1,
  distanceFilter: 1,
  debug: true, 
  interval:10000,
  startForeground:false
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform, private locationService:LocationService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.subscribeFG();
      this.subscribeBG();
    });
  }

  subscribeFG(){
    this.locationService.foreground().subscribe(()=>{
      console.log("configFG foreground OK");
      this.getCurrentPosition();
    });
  }

  getCurrentPosition(){
    this.locationService.stop();
    this.locationService.currentPosition();
    
  }

  subscribeBG(){
    this.subscribeLocation();
    this.locationService.background().subscribe((result:BackgroundGeolocationResponse)=>{
      console.log("background");
      this.locationService.configure(configBG).then((result)=>{
        if(result === "OK"){
          console.log("configBG background OK");
          this.locationService.start();
        }
      });
    });
  }

  subscribeLocation(){
    this.locationService.location().subscribe((location:BackgroundGeolocationResponse) => {
      console.log("background latitude " + location.latitude);
      console.log("background longitude " + location.longitude);
    });
  }
}