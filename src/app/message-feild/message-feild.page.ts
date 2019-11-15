import { element } from 'protractor';
import { GeneraleBehaivorService } from './../service/generale-behaivor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, Input } from '@angular/core';
import { MenuController, LoadingController, IonContent } from '@ionic/angular';
import { HttpHandlerService } from '../service/http-handler.service';
import { UserHandlerService } from '../service/user-handler.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-message-feild',
  templateUrl: './message-feild.page.html',
  styleUrls: ['./message-feild.page.scss'],
})
export class MessageFeildPage implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) private content: IonContent;
  // private event = document.getElementById('chat-parent');

  private klengOnit: boolean;
  private keyScrollToButtom: boolean;
  private keyScrolling: boolean;
  public targetname: string;
  public messageInput: string;
  public lastindexOfMessageRecieved: number;
  public Messages: Array<{
    id: number,
    isConsumed: boolean,
    isnotifited: boolean,
    message: string,
    identification: boolean,
    createdAt: string,
    updatedAt: string,
  }>;

  constructor(
    private menu: MenuController,
    private generaleBehavoi: GeneraleBehaivorService,
    private router: Router,
    private userHandler: UserHandlerService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private socket: Socket,

  ) {
    this.keyScrollToButtom = true;
    this.keyScrolling = false;
    this.klengOnit = true;
    this.route.params.subscribe(val => {
      console.log('route event activited!!!!!!');
      this.ngOnInit();
      this.klengOnit = false;
    });
    this.targetname = 'nothing';
    this.messageInput = '';
    this.lastindexOfMessageRecieved = 0;
    this.Messages = new Array<{
      id: number,
      isConsumed: boolean,
      isnotifited: boolean,
      message: string,
      identification: boolean
      createdAt: string,
      updatedAt: string,
    }>();

  }

  ngOnInit() {
    /*this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };*/
    this.keyScrollToButtom = true;
    this.keyScrolling = false;
    console.log('---------------on init---------------');
    console.log(this.klengOnit);
    if (this.klengOnit) {
      this.socket.emit('reading', {
        username: localStorage.getItem('username'),
        targetname: localStorage.getItem('targetname'),
        key: true
      });
      this.socket.on('recievemessage', (resp) => {
        console.log('response from the socket!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(resp);
        if (resp.sender === localStorage.getItem('targetname')) {
          console.log('pushing the message');
          this.lastindexOfMessageRecieved++;
          this.Messages.push({
            id: -1,
            isConsumed: true,
            isnotifited: true,
            message: resp.message,
            identification: false,
            createdAt: null,
            updatedAt: null,
          });
          if (this.content != null) {
            if (this.content.ionScrollEnd) {
              console.log('scrool to the buttom');
              this.keyScrollToButtom = true;
              this.scrollToButton();
            }
          }

        } else {
          console.log('user should be notifited');
        }
      });

      this.Messages = new Array<{
        id: number,
        isConsumed: boolean,
        isnotifited: boolean,
        message: string,
        identification: boolean,
        createdAt: string,
        updatedAt: string,
      }>();
      console.log(this.Messages);
      if (!this.generaleBehavoi.verefyConnection()) {
        this.router.navigate(['/login']);
      } else {
        this.targetname = localStorage.getItem('targetname');
        this.loadingCtrl
          .create({ keyboardClose: true, message: 'Loading ...' })
          .then(loadingEl => {
            loadingEl.present();
            this.generaleBehavoi.setLoadingCtrl(this.loadingCtrl);
            this.userHandler.onGettingMessagesSendedToTarget()
              .then((sendedmessages) => {
                console.log('finale result sended messages');
                console.log(sendedmessages);
                this.userHandler.onGettingMessagesRecievedFromTarget()
                  .then((recievedmessages) => {
                    console.log('finale resutl recieved messages');
                    console.log(recievedmessages);
                    let RecieveLenght = 0;
                    let SenderLenght = 0;
                    let index = 0;
                    while (true) {
                      if (recievedmessages[index] === undefined
                        && sendedmessages[index] === undefined) {
                        break;
                      }
                      if (recievedmessages[index] !== undefined) {
                        RecieveLenght++;
                      }
                      if (sendedmessages[index] !== undefined) {
                        SenderLenght++;
                      }
                      index++;

                    }
                    console.log('the Recieve lenght: ' + RecieveLenght);
                    console.log('the send lenght: ' + SenderLenght);
                    this.lastindexOfMessageRecieved = RecieveLenght;
                    index = 0;
                    console.log(this.Messages);
                    while (index < SenderLenght) {
                      const messageElement: {
                        id: number,
                        isConsumed: boolean,
                        isnotifited: boolean,
                        message: string,
                        identification: boolean,
                        createdAt: string,
                        updatedAt: string,
                      } = {
                        id: sendedmessages[index].id,
                        isConsumed: sendedmessages[index].isConsumed,
                        isnotifited: sendedmessages[index].isnotifited,
                        message: sendedmessages[index].message,
                        identification: true,
                        createdAt: sendedmessages[index].createdAt,
                        updatedAt: sendedmessages[index].updatedAt,
                      };
                      this.Messages.push(messageElement);
                      index++;
                    }
                    console.log(index);
                    console.log('after attaching the Messages Array to sendedMessages');
                    console.log(this.Messages);
                    console.log(this.Messages[4]);
                    console.log('ok let s carry on');
                    index = 0;
                    while (index < RecieveLenght) {
                      let i = 0;
                      console.log('----------------------operation' + index + '-------------------------------');
                      while (i < SenderLenght) {
                        console.log('-------' + i + '----------');
                        console.log(this.Messages[i]);
                        console.log(recievedmessages[index]);

                        if (this.Messages[i].id > recievedmessages[index].id) {
                          /* console.log('push elemnt');
                           console.log('id of Messages: ');
                           console.log(this.Messages[i]);
                           console.log('id of reivemessage:');
                          console.log(recievedmessages[index]);*/
                          const messageElement: {
                            id: number,
                            isConsumed: boolean,
                            isnotifited: boolean,
                            message: string,
                            identification: boolean,
                            createdAt: string,
                            updatedAt: string,
                          } = {
                            id: recievedmessages[index].id,
                            isConsumed: recievedmessages[index].isConsumed,
                            isnotifited: recievedmessages[index].isnotifited,
                            message: recievedmessages[index].message,
                            identification: false,
                            createdAt: recievedmessages[index].createdAt,
                            updatedAt: recievedmessages[index].updatedAt,
                          };
                          this.lastindexOfMessageRecieved++;
                          this.Messages.splice(i, 0, messageElement);
                          console.log(true);
                          console.log('-------end' + i + '----------');
                          break;
                        }
                        console.log(false);
                        console.log('-------end' + i + '----------');
                        i++;
                      }
                      console.log('-----------------------------end' + index + '----------------------------------');
                      if (i === SenderLenght) {
                        const messageElement: {
                          id: number,
                          isConsumed: boolean,
                          isnotifited: boolean,
                          message: string,
                          identification: boolean,
                          createdAt: string,
                          updatedAt: string,
                        } = {
                          id: recievedmessages[index].id,
                          isConsumed: recievedmessages[index].isConsumed,
                          isnotifited: recievedmessages[index].isnotifited,
                          message: recievedmessages[index].message,
                          identification: false,
                          createdAt: recievedmessages[index].createdAt,
                          updatedAt: recievedmessages[index].updatedAt,
                        };
                        this.Messages.push(messageElement);
                      }
                      SenderLenght++;
                      index++;
                    }
                    console.log('the finale results');
                    console.log('sendedMessages');
                    console.log(sendedmessages);
                    console.log('recievedMessages');
                    console.log(recievedmessages);
                    console.log(this.Messages);
                    this.loadingCtrl.dismiss();
                    this.klengOnit = true;
                  })
                  .catch((err) => {
                    console.log('-----error----');
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log('---error----');
                console.log(err);
              });
          })
          .catch(() => { console.log('error creating loadin bar'); });


      }
    }


  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngDoCheck(): void {
    // console.log('check');

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
  public scrollToButton() {
    if (this.keyScrollToButtom) {
      console.log('ng for has been completed');
      this.content.scrollToBottom()
        .then(() => console.log('operation done'));
      this.keyScrollToButtom = false;
    }

  }
  // tslint:disable-next-line:use-lifecycle-interface

  public logScrollStart(event1) {
    this.keyScrolling = true;
    //  console.log('logScrollStart');


  }
  public logScrolling(event) {
    //  console.log('------scroll going------');

  }
  public logScroolEnd() {
    //  console.log('---scroll is in the end-----');
  }
  public loadData(event) {
    console.log('::::::::data:::::::');
  }
  public sendMsg() {
    this.keyScrollToButtom = true;
    this.scrollToButton();
    console.log('send messsage: ' + this.messageInput);
    if (this.messageInput === '') {
      console.log('input it empty');
    } else {
      this.socket.emit('sendmessage', {
        sender: localStorage.getItem('username'),
        message: this.messageInput,
        reciever: localStorage.getItem('targetname'),
      });
      const elementMessag: {
        id: number,
        isConsumed: boolean,
        isnotifited: boolean,
        message: string,
        identification: boolean,
        createdAt: string,
        updatedAt: string,
      } = {
        id: -1,
        isConsumed: null,
        isnotifited: null,
        message: this.messageInput,
        identification: true,
        createdAt: null,
        updatedAt: null,
      };
      this.Messages.push(elementMessag);
      this.userHandler.onSendingMessage(this.messageInput);
      this.messageInput = '';

    }

  }

  public goBack() {
    console.log('go back to home');
    localStorage.removeItem('targetname');
    this.router.navigate(['home']);
    /*this.router.navigate(['home'])
      .then(() => {
        window.location.reload();
      });*/
    /* this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() =>
       this.router.navigate(['home']));*/
  }
  ngOnDestroy(): void {
    console.log('destroy');
    localStorage.removeItem('targetname');
  }

}
