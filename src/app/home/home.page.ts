import { GeneraleBehaivorService } from './../service/generale-behaivor.service';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs';
import { UserHandlerService } from '../service/user-handler.service';
import { Socket } from 'ngx-socket-io';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuController, LoadingController } from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IonicModule } from '@ionic/angular';
import { filter } from 'minimatch';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  private KeyngOnit: boolean;
  public segmentTab: any;
  public kleSwitch: number;
  private keyaddUserSOCKET: boolean;
  public Users: Array<{
    id: number,
    username: string,
    password: string,
    email: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
  }>;

  constructor(
    private menu: MenuController,
    public router: Router,
    private userHandler: UserHandlerService,
    private generaleBehavoi: GeneraleBehaivorService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private socket: Socket,
  ) {
    this.keyaddUserSOCKET = true;
    this.KeyngOnit = true;
    this.route.params.subscribe(val => {
      console.log('route event activited!!!!!!');
      this.ngOnInit();
      this.KeyngOnit = false;
    });
    this.kleSwitch = 0;
    this.segmentTab = 'chat';
    this.Users = new Array<{
      id: number,
      username: string,
      password: string,
      email: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string,
    }>();
  }

  ngOnInit(): void {
    /*this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };*/
    this.socket.on('addUser', (user: {
      id: number,
      username: string,
      password: string,
      email: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string,
      identification: string,
    }) => {
      console.log('::::socket add users:::::::');
      console.log(user);
      console.log('identification: ' + user.identification);
      if (user.identification === 'login') {
        console.log('acces to login');
        // let keyLogin = false;
        let index = 0;
        console.log(this.Users);
        while (index < this.Users.length) {
          if (this.Users[index].username === user.username) {
            if (!this.Users[index].isActive) {
              console.log(this.Users[index]);
              this.Users[index].isActive = true;
              /* console.log('keyLogin ' + keyLogin);
               if (keyLogin) {
                 keyLogin = false;
                 return;
               }
               keyLogin = true;*/
            }
          }
          index++;
        }
        /*if (keyLogin) {
          console.log('pushing the user');
          this.Users.push(user);
        }*/


      } else if (user.identification === 'registre') {
        let index = 0;
        while (index < this.Users.length) {
          if (this.Users[index].username === user.username) {
            return;
          }
          index++;
        }
        this.Users.push(user);

      } else if (user.identification === 'logout') {
        let index = 0;
        console.log(this.Users);
        while (index < this.Users.length) {
          if (this.Users[index].username === user.username) {
            if (this.Users[index].isActive) {
              console.log(this.Users[index]);
              this.Users[index].isActive = false;

            }
          }
          index++;
        }
      }

    });
    console.log('on init');
    console.log(this.KeyngOnit);
    if (this.KeyngOnit) {
      if (!this.generaleBehavoi.verefyConnection()) {
        this.router.navigate(['/login']);
      } else {
        this.loadingCtrl
          .create({ keyboardClose: true, message: 'Logging in...' })
          .then(loadingEl => {
            loadingEl.present();
            this.generaleBehavoi.setLoadingCtrl(this.loadingCtrl);
            console.log('you are in home right now');
            console.log('begun fetching all users');
            this.userHandler.onFectching()
              .then((result) => {
                console.log('getting the result from the promise in te service');
                this.Users = result;
                console.log('finale result is');
                console.log(this.Users);
                this.loadingCtrl.dismiss();
                this.KeyngOnit = true;
              })
              .catch((err) => {
                console.log('error fetching Uses in the server');
              });

          })
          .catch(() => { console.log('error creating loadin bar'); });

      }
    }


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
  public onClick() {
    console.log('on click on user');
  }
  public onSwitch(event: NgModule) {
    console.log(event);

  }


  public segmentChanged(event: any) {
    this.segmentTab = event.detail.value;
    console.log(this.segmentTab);
  }
  public UsersConnected(): Array<{
    id: number,
    username: string,
    password: string,
    email: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
  }> {
    return this.Users.filter(user => user.isActive === true
      && user.username !== localStorage.getItem('username'));
  }
  public UsersWithoutMe(): Array<{
    id: number,
    username: string,
    password: string,
    email: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
  }> {
    return this.Users.filter(user => user.username !== localStorage.getItem('username'));
  }
  public onChat(targetname: string) {
    console.log('targetname: ' + targetname);
    localStorage.setItem('targetname', targetname);
    // this.router.navigate(['message-feild']);
    this.router.navigateByUrl('/message-feild', { skipLocationChange: true }).then(() =>
      this.router.navigate(['message-feild']));
  }





}
