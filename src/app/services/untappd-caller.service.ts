import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UntappdCallerService {
  private baseurl = 'https://api.untappd.com/v4';
  private auth = {
    client_id: environment.client_id,
    client_secret: environment.client_secret,
  };

  constructor(private http: HttpClient) {}

  searchBeer(name): Observable<any> {
    const url = `${this.baseurl}/search/beer`;
    const paramsObj = { ...this.auth, q: name };
    const params = new HttpParams({
      fromObject: paramsObj,
    });

    return this.http.get(url, { params });
  }

  getBeerRating(bid: number): Observable<any> {
    const url = `${this.baseurl}/beer/info/${bid}`;
    const params = new HttpParams({
      fromObject: this.auth,
    });

    return this.http.get(url, { params });
  }

  authUser() {
    const url = `https://untappd.com/oauth/authenticate/`;
    const paramsObj = {
      client_id: environment.client_id,
      response_type: 'code',
      redirect_url: 'https://fejk.company',
    };

    const params = new HttpParams({
      fromObject: paramsObj,
    });

    return this.http.get(url, { params, responseType: 'text' });
    // https://untappd.com/oauth/authenticate/?client_id=CLIENTID&response_type=code&redirect_url=REDIRECT_URL
  }
}
