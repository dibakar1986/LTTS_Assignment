import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AppConfig } from './app.config';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MQTTService {
    constructor(
        private _http: HttpClient
    ) { }

    public getMQTTStatus(): Observable<any> {
        const apiUri: string = AppConfig.generateApiURI(AppConfig.MQTT_STATUS_URL);
        return this._http.get(apiUri)
            .pipe(
                catchError(this._handleError)
            );
    }

    public postControlMQTT(mode: string): Observable<any> {
        const apiUri: string = AppConfig.generateApiURI(AppConfig.MQTT_STATUS_URL);
        const httpParams: HttpParams = new HttpParams().set('mode', mode);
        return this._http.post(apiUri, {}, {params: httpParams})
            .pipe(
                catchError(this._handleError)
            );
    }

    private _handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }
}