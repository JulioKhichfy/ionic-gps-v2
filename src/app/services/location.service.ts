import { Injectable } from '@angular/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents,
  ServiceStatus,
  BackgroundGeolocationAuthorizationStatus
  }
  from '@ionic-native/background-geolocation/ngx';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SignalModel } from '../model/signal.model';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public lastLocationSubject: Subject<SignalModel> = new Subject<SignalModel>();
  public signal:SignalModel;

  constructor(private backgroundGeolocation: BackgroundGeolocation) { 
    this.location();
  }

  stationary(){
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.stationary).subscribe((stationaryLocation:BackgroundGeolocationResponse) => {
      // handle stationary locations here
    });
  }

  error(){
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.error).subscribe((error:BackgroundGeolocationResponse) => {
      console.log('[ERROR] BackgroundGeolocation error:', JSON.stringify(error));
    });

  }

  start(){
    console.log('[INFO] BackgroundGeolocation service has been started');
    this.backgroundGeolocation.start();
  }

  stop(){
    console.log('[INFO] BackgroundGeolocation service has been stopped');
    this.backgroundGeolocation.stop();
  }

  authorization():Observable<BackgroundGeolocationResponse>{
    return this.backgroundGeolocation.on(BackgroundGeolocationEvents.authorization);
  }

  background():Observable<BackgroundGeolocationResponse> {
    return this.backgroundGeolocation.on(BackgroundGeolocationEvents.background);
  }

  foreground():Observable<BackgroundGeolocationResponse> {
    return this.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground);
  }

  abortRequested(){
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.abort_requested).subscribe((response:BackgroundGeolocationResponse)=> {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });
  }

  httpAuthorization(){
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.http_authorization).subscribe((response:BackgroundGeolocationResponse)=> {
      console.log('[INFO] App needs to authorize the http requests');
    });
  }

  checkStatus(){
    this.backgroundGeolocation.checkStatus().then((status:ServiceStatus) => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
      if (status.authorization !== 1){
        setTimeout(function() {
          var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
          if (showSettings) {
            //return this.backgroundGeolocation.showAppSettings();
            console.log("autorização concedida")
          }
        }, 5000);
      }
    });
  }

  location():Observable<BackgroundGeolocationResponse>{
    return this.backgroundGeolocation.on(BackgroundGeolocationEvents.location);
  }

  configure(config):Promise<any>{
    return this.backgroundGeolocation.configure(config);
  }

  last():Promise<BackgroundGeolocationResponse>{
    return this.backgroundGeolocation.getCurrentLocation();
  }
}
