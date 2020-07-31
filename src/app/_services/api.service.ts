import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  list(resource: string) {
    return this.http.get(`/${resource}`);
  }

  get(resource: string, id: number) {
    return this.http.get(`/${resource}/${id}`)
  }
}
