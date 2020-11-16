import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const console = {
  bkg: (msg) => chrome.extension.getBackgroundPage()
};

@Injectable({
  providedIn: 'root',
})
export class UntappdCallerService {
  private baseurl = 'https://api.untappd.com/v4';
  private _token = '';

  constructor(private http: HttpClient) {}

  set token(token) {
    this._token = token;
  }

  get token(): string {
    return this._token;
  }

  getUser(): Observable<any> {
    const url = `${this.baseurl}/user/info`;
    const paramsObj = { access_token: this._token };
    const params = new HttpParams({
      fromObject: paramsObj,
    });

    return this.http.get(url, { params });
  }

  searchBeer(name): Observable<any> {
    const url = `${this.baseurl}/search/beer`;
    const paramsObj = { access_token: this._token, q: name };
    const params = new HttpParams({
      fromObject: paramsObj,
    });

    return this.http.get(url, { params });
  }

  getBeerRating(bid: number): Observable<any> {
    const url = `${this.baseurl}/beer/info/${bid}`;
    const paramsObj = { access_token: this._token };
    const params = new HttpParams({
      fromObject: paramsObj
    });

    return this.http.get(url, { params });
  }

  authorizeUser(code): Observable<any> {
    const url = `https://untappd.com/oauth/authorize/`;
    const paramsObj = {
      client_id: environment.client_id,
      client_secret: environment.client_secret,
      response_type: 'code',
      redirect_url: 'https://ihjjjjkljcndjogahhjgdejlopogagep.chromiumapp.org/untappdbolaget',
      code: code,
    };

    const params = new HttpParams({
      fromObject: paramsObj,
    });

    return this.http.get(url, { params });
  }
}
