import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditingDocumentService {

  private document = new BehaviorSubject<any>(null);
  document$ = this.document.asObservable();

  constructor() { }

  changeDocument(document: any) {
    this.document.next(document)
  }
}
