import { Component, ViewEncapsulation } from "@angular/core";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute } from "@angular/router";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";

import { TimelineEntry } from "./event";
import { TokenService } from "src/app/services/token.service";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["../../editorGlobalStyles.scss", "./events.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EventsComponent {
  timeline: TimelineEntry[];

  trashIcon = faTrash;
  plusIcon = faPlus;

  canvas: HTMLElement;
  interactiveElement: HTMLElement;

  zoom: number = 1;

  shareZoom: boolean = false;

  allowZoom: boolean = false;
  allowPan: boolean = true;

  elements = [];
  elementsPositions = [];
  elementsZooms = [];
  interactiveElements = [];

  lastMovingX = 0;
  lastMovingY = 0;

  section: string;
  subSection: string;

  documentSubSection: any;

  /* Collaborative Editing */
  isBlocked: boolean = false;
  isUserEditing: boolean = false;

  userBlocking: any = null;

  localUser = null;
  decodeToken: any;
  updateSocket: any;
  myInput: boolean = false;
  updateBlockedInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private editingDocumentService: EditingDocumentService,
    private tokenService: TokenService
  ) {}

  public canBeEdited(): boolean {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing = userEditing && userEditing?.email !== this.localUser;
    this.isBlocked =
      this.isUserEditing || this.editingDocumentService.read_only;
    if (this.isUserEditing) {
      this.userBlocking = userEditing;
    }
    return !this.isBlocked;
  }

  updateDocument(timeline: any) {
    this.myInput = true;

    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  ngOnInit() {
    this.timeline = [];
    this.shareZoom = false;

    document.addEventListener("keydown", (e) => {
      if (e.key == "Shift") {
        this.allowZoom = true;
        this.allowPan = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "Shift") {
        this.allowZoom = false;
        this.allowPan = false;
      }
    });

    this.canvas = document.getElementById("canvasContainer");
    this.canvas.addEventListener("resize", () => {});

    const intElement = document.getElementById("canvas");
    this.setInteractiveElement(intElement);

    this.addPanAndZoom(this.canvas, 1, 5, 0, 20);
    this.getSectionAndSubSection(this.route);

    /* NEW - COLLABORATIVE */
    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    this.canBeEdited();

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe((document) => {
        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited();

        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );

        let events = this.documentSubSection.subSectionContent.events;
        this.timeline = events;
      });

    this.editingDocumentService.document$
      .pipe(
        filter((document) => document !== null),
        map((document) =>
          document.documentContent
            .find((section) => section.sectionTitle === this.section)
            .subSections.find(
              (subsection) => subsection.subSectionTitle === this.subSection
            )
        ),
        take(1)
      )
      .subscribe((document) => {
        this.documentSubSection = document;

        this.timeline = document.subSectionContent.events;

        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);
      });
  }

  ngOnDestroy() {
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
    if (this.decodeToken) this.decodeToken.unsubscribe();
    if (this.updateSocket) this.updateSocket.unsubscribe();
  }

  updateIsBlocked1s() {
    this.canBeEdited();
  }

  getSectionAndSubSection(route: ActivatedRoute) {
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
  }

  rerenderButtons() {
    let buttons = document.getElementsByClassName("spec");

    for (let i = 0; i < buttons.length; i++) {
      let b = buttons[i] as HTMLElement;
      b.style.display = "grid";

      setTimeout(() => {
        b.style.display = "flex";
      }, 0.1);
    }
  }

  addEvent(id: string, missionId: string) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events.push({
      name: "",
      description: "",
    });
    this.updateDocument(this.timeline);
  }

  editEventName(
    id: string,
    missionId: string,
    eventId: string,
    content: string
  ) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events[
      parseInt(eventId)
    ].name = content;
    this.updateDocument(this.timeline);
  }

  editEventContent(
    id: string,
    missionId: string,
    eventId: string,
    content: string
  ) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events[
      parseInt(eventId)
    ].description = content;
    this.updateDocument(this.timeline);
  }

  removeEvent(id: string, missionId: string, eventId: string) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events.splice(
      parseInt(eventId),
      1
    );
    this.updateDocument(this.timeline);
  }

  addMission(id: string) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline[parseInt(id)].missions.push({ name: "", events: [] });
    this.addEvent(
      id,
      (this.timeline[parseInt(id)].missions.length - 1).toString()
    );
    this.updateDocument(this.timeline);
  }

  editMissionName(id: string, missionId: string, content: string) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline[parseInt(id)].missions[parseInt(missionId)].name = content;
    this.updateDocument(this.timeline);
  }

  removeMission(id: string, missionId: string) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline[parseInt(id)].missions.splice(parseInt(missionId), 1);
    this.updateDocument(this.timeline);
  }

  addEntry() {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline.push({ name: "", missions: [] });
    this.addMission((this.timeline.length - 1).toString());
    this.updateDocument(this.timeline);
  }

  editEntryName(id: string, content: string) {
    if (!this.canBeEdited()) {
      return;
    }

    this.timeline[parseInt(id)].name = content;
    this.updateDocument(this.timeline);
  }

  removeEntry(id: string) {
    if (!this.canBeEdited()) {
      return;
    }
    this.timeline.splice(parseInt(id), 1);
    this.updateDocument(this.timeline);
  }

  addPanAndZoom(
    element: HTMLElement,
    panSpeed: number,
    zoomSpeed: number,
    minZoom: number,
    maxZoom: number
  ) {
    this.addPanning(element, panSpeed);
    this.addZooming(element, zoomSpeed, maxZoom, minZoom);
  }

  setInteractiveElement(element: HTMLElement) {
    this.interactiveElement = element;

    let initialZoom = 1.5;

    if (!this.elements.includes(element.id)) {
      this.interactiveElements.push(element.id)
      element.style.scale = initialZoom.toString();
      this.elements.push(this.interactiveElement.id)
      this.elementsPositions.push({ lastXTranslation: 0, lastYTranslation: 0 })
      this.elementsZooms.push({ lastZoom: initialZoom })
    }
  }

  translateCanvasPositionToNewDimensions(
    x: number,
    y: number,
    oldWidth: number,
    oldHeight: number,
    newWidth: number,
    newHeight: number
  ) {
    const xRatio = newWidth / oldWidth;
    const yRatio = newHeight / oldHeight;

    return { x: x * xRatio, y: y * yRatio };
  }

  getEquivalentSpeed(zoomSpeed: number, scale: number) {
    return scale * zoomSpeed;
  }

  addPanning(element: HTMLElement, speed: number) {
    element.onpointerdown = (e) => {
      if (e.target instanceof HTMLButtonElement) {
        this.allowPan = false;
        return;
      }

      if (e.target instanceof HTMLTextAreaElement) {
        this.allowPan = false;
        return;
      }

      this.allowPan = true;

      this.pointerDownAction(element, e);
    };
    element.onpointerleave = element.onpointerup;
  }

  pointerDownAction(element: HTMLElement, e: PointerEvent) {
    if (!this.allowPan) {
      return;
    }

    let lastXTranslation = 0;
    let lastYTranslation = 0;

    let xTranslation = 0;
    let yTranslation = 0;

    let index = this.elements.indexOf(this.interactiveElement.id);

    lastXTranslation = this.elementsPositions[index].lastXTranslation;
    lastYTranslation = this.elementsPositions[index].lastYTranslation;

    element.style.cursor = "grabbing";

    const pointerDownX = e.x;
    const pointerDownY = e.y;

    let pointerMovementX = 0;
    let pointerMovementY = 0;

    element.onpointermove = (e) => {
      if (!this.allowPan) {
        return;
      }

      e.preventDefault();

      element.style.cursor = "grabbing";
      pointerMovementX = e.x;
      pointerMovementY = e.y;

      let currentCanvasScale = parseFloat(this.interactiveElement.style.scale);

      xTranslation =
        ((pointerMovementX - pointerDownX) * 1) / currentCanvasScale;
      yTranslation =
        ((pointerMovementY - pointerDownY) * 1) / currentCanvasScale;

      this.interactiveElement.style.transform = `translate(${
        lastXTranslation + xTranslation
      }px, ${lastYTranslation + yTranslation}px)`;

      element.onpointerleave = (e) => {
        if (!this.allowPan) {
          return;
        }
        element.style.cursor = "initial";
        lastXTranslation = lastXTranslation + xTranslation;
        lastYTranslation = lastYTranslation + yTranslation;

        const index = this.elements.indexOf(this.interactiveElement.id);

        this.elementsPositions[index].lastXTranslation = lastXTranslation;
        this.elementsPositions[index].lastYTranslation = lastYTranslation;

        this.stopFollowingPointer(element);
      };
    };

    element.onpointerup = (e) => {
      if (!this.allowPan) {
        return;
      }

      element.style.cursor = "initial";
      lastXTranslation = lastXTranslation + xTranslation;
      lastYTranslation = lastYTranslation + yTranslation;

      const index = this.elements.indexOf(this.interactiveElement.id);

      this.elementsPositions[index].lastXTranslation = lastXTranslation;
      this.elementsPositions[index].lastYTranslation = lastYTranslation;

      this.stopFollowingPointer(element);

      element.onpointerleave = (e) => {};
    };
  }

  followPointer(element: HTMLElement, speed: number) {
    element.onpointermove = (e) => {};
  }

  stopFollowingPointer(element: HTMLElement) {
    element.onpointermove = null;
  }

  switchElement(element: HTMLElement) {
    this.interactiveElement = element;
    this.zoom =
      this.elementsZooms[
        this.elements.indexOf(this.interactiveElement.id)
      ].lastZoom;
  }

  addZooming(
    element: HTMLElement,
    speed: number,
    maxZoom: number = 7.5,
    minZoom: number = 0
  ) {
    element.onwheel = (e) => {
      if (this.allowZoom) {
        e.preventDefault();

        let currentScale = parseFloat(this.interactiveElement.style.scale);
        let equivalentSpeed = this.getEquivalentSpeed(speed, currentScale);

        let index = this.elements.indexOf(this.interactiveElement.id);

        this.zoom = this.elementsZooms[index].lastZoom;
        this.zoom += (e.deltaY * equivalentSpeed) / -10000;

        if (this.zoom > maxZoom) {
          this.zoom = maxZoom;
        } else if (this.zoom < minZoom) {
          this.zoom = minZoom;
        }

        this.elementsZooms[index].lastZoom = this.zoom;
        if (this.shareZoom) {
          let i = 0;
          this.elements.forEach((element) => {
            let el = document.getElementById(element);
            this.elementsZooms[i].lastZoom = this.zoom;
            el.style.scale = this.zoom.toString();
            i++;
          });
        } else {
          this.elementsZooms[index].lastZoom = this.zoom;
          this.interactiveElement.style.scale = this.zoom.toString();
        }
      }
      this.rerenderButtons();
    };
  }

  removeZooming(element: HTMLElement) {
    element.onwheel = null;
  }

  onChangeBlock(event: any) {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
  }
}
