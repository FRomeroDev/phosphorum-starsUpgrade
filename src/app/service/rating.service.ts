import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { API_URL } from 'src/environment/environment';
import { IRating, IRatingPage } from '../model/model.interfaces';

@Injectable()
export class RatingAjaxService {

  ratingUrl = API_URL + "/rating";

  constructor(
    private oHttpClient: HttpClient
  ) { }

  rateReply(rating: IRating): Observable<IRating> {
    console.log('rateReply called');
    const isUpdate = rating.id !== undefined && rating.id !== null;
    const request = isUpdate
      ? this.oHttpClient.put<IRating>(`${this.ratingUrl}/${rating.id}`, rating)
      : this.oHttpClient.post<IRating>(this.ratingUrl, rating);
    console.log(rating);

    return request.pipe(
      catchError(error => {
        console.error('Error in rateReply:', error);
        throw error; // Re-throw the error after logging
      })
    );
  }

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_user: number, id_thread: number, id_reply: number): Observable<IRatingPage> {
    if (!size) size = 10;
    if (!page) page = 0;
    let strUrlUser = "";
    if (id_user > 0) {
      strUrlUser = "&user=" + id_user;
    }
    let strUrlThread = "";
    if (id_thread > 0) {
      strUrlThread = "&thread=" + id_thread;
    }
    let strUrlReply = "";
    if (id_reply > 0) {
      strUrlReply = "&reply=" + id_reply;
    }

    return this.oHttpClient.get<IRatingPage>(this.ratingUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlUser + strUrlThread + strUrlReply);
  }


  getOne(id: number): Observable<IRating> {
    return this.oHttpClient.get<IRating>(this.ratingUrl + id);
  }

  newOne(oRating: IRating): Observable<IRating> {
    return this.oHttpClient.post<IRating>(this.ratingUrl, oRating);
  }

  updateOne(oRating: IRating): Observable<IRating> {
    return this.oHttpClient.put<IRating>(this.ratingUrl, oRating);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.oHttpClient.delete<number>(this.ratingUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  generateRandom(amount: number): Observable<number> {
    return this.oHttpClient.post<number>(this.ratingUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.oHttpClient.delete<number>(this.ratingUrl + "/empty");
  }

  /*
   getByUsername(username: string): Observable<IUser> {
     return this.oHttpClient.get<IUser>(this.sUrl + "/byUsername/" + username);
   }
   */


  // En tu servicio de valoraciones (RatingService)
  getAverageRatingForReply(replyId: number): Observable<number> {
    console.log('getAverageRatingForReply called');
    return this.oHttpClient.get<number>(`${this.ratingUrl}/average/${replyId}`);
  }


  getAverageRatingForAllReplies(): Observable<Map<number, number>> {
    console.log('getAverageRatingForAllReplies called');
    return this.oHttpClient.get<Map<number, number>>(`${this.ratingUrl}/average/all`);
  }














}