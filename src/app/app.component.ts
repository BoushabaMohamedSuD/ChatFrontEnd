import { Component, OnDestroy } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Socket } from 'ngx-socket-io';
import { UserHandlerService } from './service/user-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {
  private keyStart: boolean;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socket: Socket,
    private menu: MenuController,
    private UserHandler: UserHandlerService,
  ) {
    console.log('setting the app component');
    this.keyStart = true;
    this.socket.on('nodejs', (data: any) => {
      console.log('------the main model start------');
      console.log('-----fetching  socket from the servor-----');
      console.log(data);
      console.log('------end---------');

      /* if (this.keyStart) {
         console.log('sendin the first socket of start naviagtion');
         console.log('start navigation');
         this.socket.emit('start', {
           username: localStorage.getItem('username'),
           targetname: '',
           key: false
         });
         this.keyStart = false;
       }*/

    });
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public Logout() {
    console.log('logout');
    this.UserHandler.onLogout();

  }
  public Profile() {
    console.log('profile');
    this.menu.close('first');
  }
  public openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  ngOnDestroy(): void {
    /*console.log('logout');
    this.UserHandler.onLogout();*/

  }
}
