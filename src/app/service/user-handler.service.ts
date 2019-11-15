import { Router } from '@angular/router';
import { GeneraleBehaivorService } from './generale-behaivor.service';
import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { NgForm } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UserHandlerService {

  constructor(
    private httpHadler: HttpHandlerService,
    private genraleBehaivor: GeneraleBehaivorService,
    private router: Router,
    private socket: Socket,
  ) { }

  onLogin(f: NgForm) {
    if (/*f.valid*/ true) {
      if (
        (f.value.username as string) !== '' &&
        (f.value.password as string) !== ''
      ) {
        this.httpHadler.onLogin(f).subscribe(
          (resp) => {
            console.log('-----responseLogin-------');
            console.log(resp.body);
            if (resp.body) {
              this.genraleBehaivor.setKleError(false);
              this.genraleBehaivor.setIsConnected(true);
              const token: string = resp.headers.get('Authorization');
              const Username: string = resp.headers.get('Username');
              console.log(token);
              console.log(Username);
              localStorage.setItem('token', token);
              localStorage.setItem('username', Username);
              this.socket.emit('start', {
                username: localStorage.getItem('username'),
                targetname: '',
                key: false
              });
              this.router.navigate(['/home']);
              this.genraleBehaivor.getLoadingCtrl().dismiss();
            } else {
              console.log('error authentication');
              this.genraleBehaivor.setIsConnected(false);
              this.genraleBehaivor.setKleError(true);

              this.genraleBehaivor.getLoadingCtrl().dismiss();
            }


          },
          (err) => {
            console.log('-------errorLogin------');
            console.log(err);
            console.log('error authentication');
            this.genraleBehaivor.setIsConnected(false);
            this.genraleBehaivor.setKleError(true);
            this.genraleBehaivor.getLoadingCtrl().dismiss();
          },
          () => { console.log('good job'); }
        );
      } else {
        console.log('some of inputs is empty');
        this.genraleBehaivor.setIsConnected(false);
        this.genraleBehaivor.setKleError(true);
        this.genraleBehaivor.getLoadingCtrl().dismiss();
      }
    } else {
      console.log('form is not valid');
      this.genraleBehaivor.setIsConnected(false);
      this.genraleBehaivor.setKleError(true);
      this.genraleBehaivor.getLoadingCtrl().dismiss();
    }


  }
  onSignup(f: NgForm) {
    if (/*f.valid*/ true) {
      if (
        (f.value.username as string) !== '' &&
        (f.value.password as string) !== '' &&
        (f.value.email as string) !== '' &&
        (f.value.cfpassword as string) !== ''
      ) {
        this.httpHadler.onSignup(f).subscribe(
          (resp) => {
            console.log('-----responseRegistre-------');
            console.log('respBody ' + resp.body);
            if (resp.body) {
              console.log(resp.body);
              this.genraleBehaivor.setKleError(false);
              this.genraleBehaivor.setIsConnected(true);
              this.router.navigate(['/home']);
              this.genraleBehaivor.getLoadingCtrl().dismiss();
              const token: string = resp.headers.get('Authorization');
              const Username: string = resp.headers.get('Username');
              console.log(token);
              console.log(Username);
              localStorage.setItem('token', token);
              localStorage.setItem('username', Username);
              this.socket.emit('start', {
                username: localStorage.getItem('username'),
                targetname: '',
                key: false
              });
            } else {
              console.log('error authentication');
              this.genraleBehaivor.setIsConnected(false);
              this.genraleBehaivor.setKleError(true);
              this.genraleBehaivor.getLoadingCtrl().dismiss();
            }
          },
          (err) => {
            console.log('-------errorRegistre------');
            console.log('error authentication');
            this.genraleBehaivor.setIsConnected(false);
            this.genraleBehaivor.setKleError(true);
            this.genraleBehaivor.getLoadingCtrl().dismiss();
          },
          () => { console.log('good job'); }
        );
      } else {
        console.log('some of inputs is empty');
        this.genraleBehaivor.setIsConnected(false);
        this.genraleBehaivor.setKleError(true);
        this.genraleBehaivor.getLoadingCtrl().dismiss();
      }
    } else {
      console.log('form is not valid');
      this.genraleBehaivor.setIsConnected(false);
      this.genraleBehaivor.setKleError(true);
      this.genraleBehaivor.getLoadingCtrl().dismiss();
    }

  }
  onLogout() {
    console.log('-------logout-------');
    this.httpHadler.onLogout().subscribe(
      (resp) => {
        console.log('-----respLogout---------');
        console.log(resp.body);
        if (resp.body) {
          localStorage.clear();
          this.genraleBehaivor.setIsConnected(false);
          this.genraleBehaivor.setKleError(false);
          this.genraleBehaivor.setIsConnected(true);
          this.router.navigate(['/login']);
        }
      },
      (err) => {
        console.log('error');
      },
      () => {
        console.log('good job');
      }

    );

  }
  onFectching(): Promise<any> {
    console.log('----get all users-----');
    return new Promise((resolve, reject) => {
      this.httpHadler.onFetching().subscribe(
        (result) => {
          console.log('-----getting the result------');
          console.log(result.body);
          if (result == null) {
            console.log('database is empty');
          }
          console.log(result.body[2].username);
          resolve(result.body);
        },
        (err) => {
          console.log('error ftching all users');
          console.log(err);
          reject(false);
        },
        () => {
          console.log('good job');
        }
      );
    });


  }
  onGettingMessagesSendedToTarget(): Promise<any> {
    console.log('gettign messages sended to target');
    return new Promise((resolve, reject) => {
      this.httpHadler.onGettingMessagesSendedToTarget().subscribe(
        (result) => {
          console.log('getting result sended messages');

          if (result.body == null) {
            console.log('messages are epmty no');
          }
          resolve(result.body);
        },
        (err) => {
          console.log('error getting messages sended');
          console.log(err);
          reject(false);
        },
        () => {
          console.log('good job');
        }
      );

    });
  }
  onGettingMessagesRecievedFromTarget(): Promise<any> {
    console.log('getting recieved message from this target');
    return new Promise((resolve, reject) => {
      this.httpHadler.onGettingMessagesRecievedFromTarget().subscribe(
        (result) => {
          console.log('getting result recieved messages');
          if (result.body == null) {
            console.log('messages are epmty no');
          }
          resolve(result.body);
        },
        (err) => {
          console.log('error getting messages recieved');
          console.log(err);
          reject(false);
        },
        () => {
          console.log('good job');
        }
      );

    });
  }
  onSendingMessage(message: string) {
    console.log('-----sending message----');
    this.httpHadler.onSendingMessage(message).subscribe(
      (result) => {
        console.log('success sending message');
        console.log(result.body);
      },
      (err) => {
        console.log('error');
        console.log(err);
      },
      () => {
        console.log('good job');
      }
    );
  }
}
