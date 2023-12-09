import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { API_URL } from 'src/environment/environment';
import { IToken, IUser, SessionEvent } from '../model/model.interfaces';
import { UserAjaxService } from './user.ajax.service.service';

@Injectable()
export class SessionAjaxService {

    sUrl: string = API_URL + "/session";

    subjectSession = new Subject<SessionEvent>();

    constructor(
        private oHttpClient: HttpClient,
        private oUserAjaxService: UserAjaxService
    ) { }

    private parseJwt(token: string): IToken {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    login(sUsername: string, sPassword: string): Observable<string> {
        //const sUser: string = JSON.stringify({ username: sUsername, password: sPassword });
        return this.oHttpClient.post<string>(this.sUrl, { username: sUsername, password: sPassword });
    }

    setToken(sToken: string): void {
        localStorage.setItem('token', sToken);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    isSessionActive(): Boolean {
        let strToken: string | null = localStorage.getItem('token');
        if (strToken) {
            let oDecodedToken: IToken = this.parseJwt(strToken);
            if (Date.now() >= oDecodedToken.exp * 1000) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    getUsername(): string {
        if (this.isSessionActive()) {
            let token: string | null = localStorage.getItem('token');
            if (!token) {
                return "";
            } else {
                return this.parseJwt(token).name;
            }
        } else {
            return "";
        }
    }

    on(): Observable<SessionEvent> {
        return this.subjectSession.asObservable();
    }

    emit(event: SessionEvent) {
        this.subjectSession.next(event);
    }

    getSessionUser(): Observable<IUser> | null {
        if (this.isSessionActive()) {
            return this.oUserAjaxService.getByUsername(this.getUsername())
        } else {
            return null;
        }
    }

    // OBTIENE EL ID DEL USERNAME LOGEADO LLAMANDO AL MÉTODO GETUSERNAME DE LA SESSION
    getUserId(): Observable<number | null> {
        const username: string = this.getUsername();
        if (username) {
            // Llama al método getOne para obtener el ID del usuario por su nombre de usuario
            return this.oUserAjaxService.getByUsername(username).pipe(
                map(user => user.id), // Utiliza el ID del usuario del resultado
                catchError(() => of(null)) // Maneja cualquier error y devuelve un observable con null
            );
        } else {
            return of(null); // O devuelve un observable con null si el nombre de usuario no está presente
        }
    }
}
