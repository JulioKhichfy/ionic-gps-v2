import { Component } from '@angular/core';
import { BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

import { Platform } from '@ionic/angular';
import { SignalModel } from './model/signal.model';
import { LocationService } from './services/location.service';

const configFG: BackgroundGeolocationConfig = {
  desiredAccuracy: 0,
  stationaryRadius: 1,
  distanceFilter: 1,
  debug: false, 
  interval:5000,
  startForeground:true
}

const configBG: BackgroundGeolocationConfig = {
  desiredAccuracy: 0,
  stationaryRadius: 1,
  distanceFilter: 1,
  debug: true, 
  interval:5000,
  startForeground:false
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  interval:any;
  constructor(private platform: Platform, private locationService:LocationService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.locationService.configure(configFG).then((result)=>{
        console.log(">>>>> configure " + JSON.stringify(result));
        if(result === "OK"){
          this.subscribeLocation();
          this.subscribeFG();
          this.subscribeBG();
          this.locationService.stop();
        }
      });
    });
  }

  subscribeFG(){
    this.locationService.foreground().subscribe((result:BackgroundGeolocationResponse)=>{
      console.log("foreground");
      this.locationService.configure(configFG).then((result)=>{
        if(result === "OK"){
          console.log("configFG foreground OK");
          this.locationService.stop();
          this.interval = setInterval(()=>{
            this.locationService.last().then((response:BackgroundGeolocationResponse)=>{
              console.log("foreground latitude " + response.latitude)
              console.log("foreground longitude " + response.longitude)
              let signal:SignalModel = new SignalModel(response.latitude, response.longitude)
              this.locationService.lastLocationSubject.next(signal);
            })
          },5000)
          
        }
      })
    });
  }

  subscribeBG(){
    this.locationService.background().subscribe((result:BackgroundGeolocationResponse)=>{
      console.log("background");
      clearInterval(this.interval);
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