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

  updateDocumentSubSection(section: any, subSection: any, content: any) {
    const document = this.document.getValue();
    const secId = document.documentContent.findIndex((obj => obj.sectionTitle == section));
    const subSecId = document.documentContent[secId].subSections.findIndex((obj => obj.subSectionTitle == subSection));
    document.documentContent[secId].subSections[subSecId] = content;
    this.document.next(document);
  }
}
