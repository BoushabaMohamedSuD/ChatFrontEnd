import { LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneraleBehaivorService {
  private isConnected: boolean;
  private kleError: boolean;
  private loadingCtrl: LoadingController;

  constructor() {
    this.isConnected = false;
    this.kleError = false;
  }
  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public setIsConnected(isConnected: boolean) {
    this.isConnected = isConnected;
  }
  public getKleError(): boolean {
    return this.kleError;
  }

  public setKleError(KleError: boolean) {
    this.kleError = KleError;
  }
  public getLoadingCtrl(): LoadingController {
    return this.loadingCtrl;
  }

  public setLoadingCtrl(LoadinCtrl: LoadingController) {
    this.loadingCtrl = LoadinCtrl;
  }
  public verefyConnection(): boolean {
    if (localStorage.getItem('username') != null
      && localStorage.getItem('token') != null) {
      return true;
    }
    return false;
  }
}
