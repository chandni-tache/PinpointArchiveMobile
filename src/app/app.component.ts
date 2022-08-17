import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { HttpClient } from '@angular/common/http';
import { Device } from '@awesome-cordova-plugins/device/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private device: Device, private http: HttpClient, private fcm: FCM, private platform: Platform) {
    // alert("f")

    this.platform.ready().then(() => {


      // console.log(window)
      const w: any = window;
      console.log('push permissions success', w.FCM);


      if (w.cordova.platformId == 'android') {

        w.FCM.getToken().then(token => {
          console.log(token, "dfd")
          this.sendTokenTOServer(token, "GCM", device)

        });

      } else {
        
        w.FCM.requestPushPermission({
          ios9Support: {
            timeout: 10,  // How long it will wait for a decision from the user before returning `false`
            interval: 0.3 // How long between each permission verification
          }
        })

          w.FCM.getAPNSToken().then(token => {
            console.log(token, "dfd")
            this.sendTokenTOServer(token, "APNS_SANDBOX", device)

          });
        



      }


      w.FCM.onNotification((payload) => {


        alert(payload.title + ' ' + payload.body + "AWS notification")

      })


    });



  }

  async sendTokenTOServer(token, type, device) {
    let jsonsend = {
      "channelType": type,
      "make": device.manufacturer,
      "model": device.model,
      "modelVersion": device.version,
      "platform": device.platform,
      "platformVersion": device.version,
      "token": token,
      "userId": device.uuid
    }



    this.http
      .post('http://ec2-65-0-108-73.ap-south-1.compute.amazonaws.com:8080/pinpoint/api/createEndPoint', jsonsend)
      .subscribe((response) => {
        console.log(response);
      });
  }


}
