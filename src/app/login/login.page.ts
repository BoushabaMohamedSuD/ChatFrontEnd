import { GeneraleBehaivorService } from './../service/generale-behaivor.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs';
import { UserHandlerService } from '../service/user-handler.service';
import { Socket } from 'ngx-socket-io';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public switch: boolean;
  private isConnected: boolean;
  private kleErro: boolean;
  constructor(
    private userHandler: UserHandlerService,
    private socket: Socket,
    private http: HttpClient,
    private menu: MenuController,
    private loadingCtrl: LoadingController,
    private generaleBehavoi: GeneraleBehaivorService,
    private router: Router,
  ) {
    this.isConnected = false;
    this.kleErro = false;
    this.switch = false;
  }


  ngOnInit() {
    if (this.generaleBehavoi.verefyConnection()) {
      this.router.navigate(['/home']);
    }
    console.log('emit the first socket');
    this.socket.emit('ionic', 'welcome to the login page from ionic');
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngDoCheck(): void {
    /* this.kleErro = this.generaleBehavoi.getKleError();
     if (this.kleErro) {
       this.loadingCtrl.dismiss();
       this.generaleBehavoi.setKleError(false);
     }*/
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

  public onSubmit(f: NgForm) {
    console.log(f.value);
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        this.generaleBehavoi.setLoadingCtrl(this.loadingCtrl);
        this.socket.emit('ionic', 'clietn press submit button from ionic');
        if (this.switch) {
          console.log('registre');
          this.userHandler.onSignup(f);
        } else {
          console.log('login');
          this.userHandler.onLogin(f);
        }
      })
      .catch(() => { console.log('error creating loadin bar'); });


  }


  public onSwitchAuthMode() {
    console.log('emit the first socket');
    this.socket.emit('ionic', { hello: 'world' });
    if (this.switch === false) {
      this.switch = true;
    } else {
      this.switch = false;
    }
    console.log(this.switch);
  }

  public test() {
    const headersx = new HttpHeaders();
    const headers = headersx.append('Content-Type', 'application/json')
      .append('authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.Qm91c2hhYmE.zHxoXXwpAtwxw0S9cm6m2bkD_k2122soa_zOdO2h7F0')
      .append('Username', 'Boushaba');
    this.http.get('http://localhost:3000/messages/getsendedmessages/', { headers, observe: 'response' })
      .subscribe(
        (resp) => {
          console.log(resp.body);
          console.log(resp.body[0]);
          // tslint:disable-next-line:no-inferrable-types
          let index: number = 0;
          while (true) {
            if (resp.body[index] === undefined) {
              console.log('braek');
              console.log(index);
              break;
            }
            console.log(resp.body[index].message);
            index++;
          }

          console.log(resp.body[0]);



        },
        (err) => {
          console.log(err);
        },
        () => {
          console.log('complet');
        }
      );
  }

}
