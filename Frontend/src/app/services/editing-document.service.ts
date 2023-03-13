import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditingDocumentService {

  private document = new BehaviorSubject<any>({});
  currentDocument = this.document.asObservable();

  constructor() { }

  changeDocument(document: any) {
    console.log("old document:", document);
    this.document.next(document)
    console.log("new document:", document);
  }

}
