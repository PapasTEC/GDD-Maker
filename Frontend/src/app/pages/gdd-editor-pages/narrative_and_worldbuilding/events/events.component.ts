import { Component, ViewEncapsulation } from '@angular/core';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { EditingDocumentService } from 'src/app/services/editing-document.service';
import { filter, map, take } from "rxjs/operators";

import { TimelineEntry } from './event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  elements = []
  elementsPositions = []
  elementsZooms = []
  interactiveElements = []

  lastMovingX = 0;
  lastMovingY = 0;

  section: string;
  subSection: string;

  documentSubSection: any;

  constructor(private route: ActivatedRoute, private editingDocumentService: EditingDocumentService) { }

  ngOnInit() {

    //  {name: "Mission 1", missions: [{name: "Event 1", events: [{name: "Event 1", description: "Event 1"}, {name: "Event 2", description: "Event 2"}]}, {name: "Event 2", events: [{name: "Event 1", description: "Event 1"}, {name: "Event 2", description: "Event 2"}]}]}, {name: "Mission 2", missions: [{name: "Event 1", events: [{name: "Event 1", description: "Event 1"}, {name: "Event 2", description: "Event 2"}]}, {name: "Event 2", events: [{name: "Event 1", description: "Event 1"}, {name: "Event 2", description: "Event 2"}]}]}
    this.timeline = []
    this.shareZoom = false;

    document.addEventListener("keydown", (e) => {
      if (e.key == "Shift") {
        this.allowZoom = true;
        this.allowPan = true;
      }

    })

    document.addEventListener("keyup", (e) => {
      if (e.key == "Shift") {
        this.allowZoom = false;
        this.allowPan = false;
      }
    })

    this.canvas = document.getElementById("canvasContainer");
    this.canvas.addEventListener("resize", () => {
      console.log("resize")
    })

    // intElement.style.height = (intElement.parentElement.clientHeight).toString() + "px";
    // intElement.style.width = (intElement.parentElement.clientWidth*0.6).toString() + "px";

    const intElement = document.getElementById("canvas");
    this.setInteractiveElement(intElement)
    //this.setInteractiveElement(document.getElementById("canvas2"))

    this.addPanAndZoom(this.canvas, 1, 5, 0, 20);
    this.getSectionAndSubSection(this.route);

    console.log(this.section, this.subSection)

    console.log(this.editingDocumentService)

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
      ).subscribe((document) => {

        this.documentSubSection = document;
        this.timeline = document.subSectionContent.events;

      });

  }

  getSectionAndSubSection(route: ActivatedRoute) {
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });

    console.log(this.section, this.subSection)
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
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events.push({ name: "", description: "" });
  }

  editEventName(id: string, missionId: string, eventId: string, content: string) {
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events[parseInt(eventId)].name = content;
  }

  editEventContent(id: string, missionId: string, eventId: string, content: string) {
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events[parseInt(eventId)].description = content;
  }

  removeEvent(id: string, missionId: string, eventId: string) {
    this.timeline[parseInt(id)].missions[parseInt(missionId)].events.splice(parseInt(eventId), 1);
  }

  addMission(id: string) {
    this.timeline[parseInt(id)].missions.push({ name: "", events: [] })
    this.addEvent(id, (this.timeline[parseInt(id)].missions.length - 1).toString())
  }

  editMissionName(id: string, missionId: string, content: string) {
    this.timeline[parseInt(id)].missions[parseInt(missionId)].name = content;
  }

  removeMission(id: string, missionId: string) {
    this.timeline[parseInt(id)].missions.splice(parseInt(missionId), 1);
  }

  addEntry() {
    this.timeline.push({ name: "", missions: [] })
    this.addMission((this.timeline.length - 1).toString())
  }

  editEntryName(id: string, content: string) {
    console.log(content)
    this.timeline[parseInt(id)].name = content;
  }

  removeEntry(id: string) {
    this.timeline.splice(parseInt(id), 1);
  }

  addPanAndZoom(element: HTMLElement, panSpeed: number, zoomSpeed: number, minZoom: number, maxZoom: number) {
    this.addPanning(element, panSpeed);
    this.addZooming(element, zoomSpeed, maxZoom, minZoom);
  }

  setInteractiveElement(element: HTMLElement) {

    this.interactiveElement = element;

    if (!this.elements.includes(element.id)) {
      this.interactiveElements.push(element.id)
      element.style.scale = "1";
      this.elements.push(this.interactiveElement.id)
      this.elementsPositions.push({ lastXTranslation: 0, lastYTranslation: 0 })
      this.elementsZooms.push({ lastZoom: 1 })
    }
    
  }

  translateCanvasPositionToNewDimensions(x: number, y: number, oldWidth: number, oldHeight: number, newWidth: number, newHeight: number) {
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

    }
    element.onpointerleave = element.onpointerup;

  }

  pointerDownAction(element: HTMLElement, e: PointerEvent) {

    if (!this.allowPan) {
      console.log("panning not allowed")
      return;
    }

    let lastXTranslation = 0;
    let lastYTranslation = 0;

    let xTranslation = 0;
    let yTranslation = 0;

    let index = this.elements.indexOf(this.interactiveElement.id)

    lastXTranslation = this.elementsPositions[index].lastXTranslation
    lastYTranslation = this.elementsPositions[index].lastYTranslation

    element.style.cursor = "grabbing";

    const pointerDownX = e.x;
    const pointerDownY = e.y;

    let pointerMovementX = 0;
    let pointerMovementY = 0;



    element.onpointermove = (e) => {

      if (!this.allowPan) {
        console.log("panning not allowed")
        return;
      }

      e.preventDefault();

      element.style.cursor = "grabbing";
      pointerMovementX = e.x;
      pointerMovementY = e.y;

      let currentCanvasScale = parseFloat(this.interactiveElement.style.scale);

      xTranslation = ((((pointerMovementX - pointerDownX)) * 1 / currentCanvasScale));
      yTranslation = ((((pointerMovementY - pointerDownY)) * 1 / currentCanvasScale));


      this.interactiveElement.style.transform = `translate(${lastXTranslation + xTranslation}px, ${lastYTranslation + yTranslation}px)`;

      element.onpointerleave = (e) => {
        if (!this.allowPan) {
          console.log("panning not allowed")
          return;
        }
        element.style.cursor = "initial";
        lastXTranslation = lastXTranslation + xTranslation;
        lastYTranslation = lastYTranslation + yTranslation;

        const index = this.elements.indexOf(this.interactiveElement.id)

        this.elementsPositions[index].lastXTranslation = lastXTranslation
        this.elementsPositions[index].lastYTranslation = lastYTranslation

        this.stopFollowingPointer(element);

      }
    }

    element.onpointerup = (e) => {
      if (!this.allowPan) {
        console.log("panning not allowed")
        return;
      }

      element.style.cursor = "initial";
      lastXTranslation = lastXTranslation + xTranslation;
      lastYTranslation = lastYTranslation + yTranslation;

      const index = this.elements.indexOf(this.interactiveElement.id)

      this.elementsPositions[index].lastXTranslation = lastXTranslation
      this.elementsPositions[index].lastYTranslation = lastYTranslation

      this.stopFollowingPointer(element);

      element.onpointerleave = (e) => { };
    }
  }

  followPointer(element: HTMLElement, speed: number) {
    element.onpointermove = (e) => { }
  }

  stopFollowingPointer(element: HTMLElement) {
    element.onpointermove = null;
  }

  switchElement(element: HTMLElement) {
    this.interactiveElement = element;
    this.zoom = this.elementsZooms[this.elements.indexOf(this.interactiveElement.id)].lastZoom;
  }

  addZooming(element: HTMLElement, speed: number, maxZoom: number = 7.5, minZoom: number = 0) {

    element.onwheel = (e) => {

      if (this.allowZoom) {

        // if(e.deltaY > 0) {
        //   this.interactiveElement = document.getElementById("canvas2");
        // }else{
        //   this.interactiveElement = document.getElementById("interactiveElement");
        // }
        // let targ = e.target as HTMLElement;

        // if(targ.id == "txtArea" && targ.clientHeight < targ.scrollHeight){
        //   return;
        // }

        e.preventDefault();



        let currentScale = parseFloat(this.interactiveElement.style.scale);
        let equivalentSpeed = this.getEquivalentSpeed(speed, currentScale);

        let index = this.elements.indexOf(this.interactiveElement.id)

        this.zoom = this.elementsZooms[index].lastZoom;
        this.zoom += (e.deltaY * equivalentSpeed) / -(10000);

        if (this.zoom > maxZoom) {
          this.zoom = maxZoom;
        } else if (this.zoom < minZoom) {
          this.zoom = minZoom;
        }

        this.elementsZooms[index].lastZoom = this.zoom
        if (this.shareZoom) {
          let i = 0;
          this.elements.forEach(element => {
            let el = document.getElementById(element)
            this.elementsZooms[i].lastZoom = this.zoom
            el.style.scale = this.zoom.toString();
            i++;
          });
        } else {
          this.elementsZooms[index].lastZoom = this.zoom
          this.interactiveElement.style.scale = this.zoom.toString();
        }
      }
      this.rerenderButtons();
    }



  }

  removeZooming(element: HTMLElement) {
    element.onwheel = null;
  }


}
