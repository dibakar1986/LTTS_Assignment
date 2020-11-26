import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MQTTService } from './mqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private _ngSubscription$: Subject<boolean> = new Subject<boolean>();
  public postResponse: string;
  public getResponse: string;
  public postControl: string;
  constructor(
    private _mqttService: MQTTService
  ) {
    this.postResponse = '';
    this.getResponse = '';
    this.postControl = 'start';
  }


  public sendPostControl(): void {
    const control: string = this.postControl;
    this._mqttService.postControlMQTT(control)
      .pipe(takeUntil(this._ngSubscription$))
      .subscribe(status => {
        if (status) {
          this.postResponse = JSON.stringify(status);
        }
      });
  }

  public sendGetControl(): void {
    this._mqttService.getMQTTStatus()
      .pipe(takeUntil(this._ngSubscription$))
      .subscribe(status => {
        if (status) {
          this.getResponse = JSON.stringify(status);
        }
      });
  }

  ngOnDestroy() {
    this._ngSubscription$.next();
    this._ngSubscription$.complete();
  }
}
