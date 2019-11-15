import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {

  constructor(private http: HttpClient) { }
  onLogin(f: NgForm) {
    const userLogin: {
      username: string,
      password: string
    } = {
      username: f.value.username,
      password: f.value.password
    };
    console.log(userLogin);

    return this.http.post('http://localhost:3000/login', userLogin, { observe: 'response' });
  }
  onSignup(f: NgForm) {
    const userRegistre: {
      username: string,
      password: string,
      email: string,
      cfpassword: string
    } = {
      username: f.value.username,
      password: f.value.password,
      email: f.value.email,
      cfpassword: f.value.cfpassword
    };
    console.log(userRegistre);

    return this.http.post('http://localhost:3000/registre', userRegistre, { observe: 'response' });
  }
  onLogout() {
    const headersx = new HttpHeaders();
    const headers = headersx.append('Content-Type', 'application/json')
      .append('authorization', 'Bearer ' + localStorage.getItem('token'))
      .append('Username', localStorage.getItem('username'));
    return this.http.put('http://localhost:3000/logout', { data: 'logout' }, { headers, observe: 'response' });
  }
  onFetching() {
    console.log('sending the http request');
    const headersx = new HttpHeaders();
    const headers = headersx.append('Content-Type', 'application/json')
      .append('authorization', 'Bearer ' + localStorage.getItem('token'))
      .append('Username', localStorage.getItem('username'));
    return this.http.get('http://localhost:3000/fetch/allUsers', { headers, observe: 'response' });
  }
  onGettingMessagesSendedToTarget() {
    console.log('getting messages sended and send http reqeust');
    const headersx = new HttpHeaders();
    const headers = headersx.append('Content-Type', 'application/json')
      .append('authorization', 'Bearer ' + localStorage.getItem('token'))
      .append('Username', localStorage.getItem('username'));
    return this.http.get('http://localhost:3000/messages/getsendedmessages/' + localStorage.getItem('targetname')
      , { headers, observe: 'response' });
  }
  onGettingMessagesRecievedFromTarget() {
    console.log('getting messages sended and send http reqeust');
    const headersx = new HttpHeaders();
    const headers = headersx.append('Content-Type', 'application/json')
      .append('authorization', 'Bearer ' + localStorage.getItem('token'))
      .append('Username', localStorage.getItem('username'));
    return this.http.get('http://localhost:3000/messages/getrecievedmessages/' + localStorage.getItem('targetname')
      , { headers, observe: 'response' });
  }
  onSendingMessage(message: string) {
    console.log('sending message to the servor');
    console.log(message);
    const headersx = new HttpHeaders();
    const headers = headersx.append('Content-Type', 'application/json')
      .append('authorization', 'Bearer ' + localStorage.getItem('token'))
      .append('Username', localStorage.getItem('username'));
    return this.http.post('http://localhost:3000/messages/send/' + localStorage.getItem('targetname')
      , { message: message as string }, { headers, observe: 'response' });

  }
}
