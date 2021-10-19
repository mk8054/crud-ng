import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  baseUrl: string =
    'https://crudcrud.com/api/463026d45e2e4f538ba92ea67502df3c/';
  constructor(private http: HttpClient) {}

  getUrl(url: string) {
    return this.baseUrl + url;
  }

  httpRequest(req: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) {
    if (req === 'get') return this.http.get(this.getUrl(url));
    else if (req === 'post') return this.http.post(this.getUrl(url), data);
    else if (req === 'put') return this.http.put(this.getUrl(url), data);
    else if (req === 'delete') return this.http.delete(this.getUrl(url));
    return null;
  }
}
