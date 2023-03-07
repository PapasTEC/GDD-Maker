import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  API = '/api/documents/';

  constructor(private http: HttpClient) {}

  getDocuments() {
    return this.http.get<any>(this.API + 'get/');
  }

  getDocument(id: string) {
    return this.http.get<any>(this.API + 'get/' + id);
  }

  addDocument(document: any) {
    return this.http.post(this.API + 'add/', document);
  }

  updateDocument(id: string, document: any) {
    return this.http.put(this.API + 'update/' + id, document);
  }

  deleteDocument(id: string) {
    return this.http.delete(this.API + 'delete/' + id);
  }

  getMyProjects(owner: string) {
    return this.http.get<any>(this.API + 'getInfoByOwner/' + owner);
  }

  getSharedProjects(ids: any) {
    return this.http.post<any>(this.API + 'getInfoShared/', ids);
  }
}