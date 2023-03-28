import { Component } from '@angular/core';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss', '../../editorGlobalStyles.scss']
})
export class EventsComponent {

  trashIcon = faTrash;
  plusIcon = faPlus;

  canvas:HTMLElement;
  interactiveElement:HTMLElement;

  zoom:number = 1;

  shareZoom:boolean = false;

  elements = []
  elementsPositions = []
  elementsZooms = []
  interactiveElements = []

  constructor() {}

  lastMovingX = 0;
  lastMovingY = 0;

  ngOnInit() {

    this.shareZoom = false;

    this.canvas = document.getElementById("canvasContainer");

    const intElement = document.getElementById("canvas");

    intElement.style.height = (intElement.parentElement.clientHeight).toString() + "px";
    intElement.style.width = (intElement.parentElement.clientWidth*0.6).toString() + "px";
    
    this.setInteractiveElement(intElement)
    //this.setInteractiveElement(document.getElementById("canvas2"))

    this.addPanAndZoom(this.canvas, 1 , 5, 0, 20);

  }

  addPanAndZoom(element: HTMLElement, panSpeed: number, zoomSpeed:number, minZoom: number, maxZoom: number) {
    this.addPanning(element, panSpeed);
    this.addZooming(element, zoomSpeed, maxZoom, minZoom);
  }

  setInteractiveElement(element: HTMLElement) {

    this.interactiveElement = element;
    
    if(!this.elements.includes(element.id)){
      this.interactiveElements.push(element.id)
      element.style.scale = "1";
      this.elements.push(this.interactiveElement.id)
      this.elementsPositions.push({lastXTranslation: 0, lastYTranslation: 0})
      this.elementsZooms.push({lastZoom: 1})
    }

  }

  getEquivalentSpeed(zoomSpeed: number, scale: number) {
    return scale * zoomSpeed;
  }

  addPanning(element: HTMLElement, speed: number) {

    element.onpointerdown = (e) => {

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

        e.preventDefault();

        element.style.cursor = "grabbing";
        pointerMovementX = e.x;
        pointerMovementY = e.y;

        let currentCanvasScale = parseFloat(this.interactiveElement.style.scale);

        xTranslation = ( ( ( (pointerMovementX - pointerDownX) ) * 1/currentCanvasScale ));
        yTranslation = ( ( ( (pointerMovementY - pointerDownY) ) * 1/currentCanvasScale ) );


        this.interactiveElement.style.transform = `translate(${lastXTranslation + xTranslation}px, ${lastYTranslation + yTranslation}px)`;

      }

      element.onpointerup = (e) => {

        element.style.cursor = "initial";
        lastXTranslation = lastXTranslation + xTranslation;
        lastYTranslation = lastYTranslation + yTranslation;

        const index = this.elements.indexOf(this.interactiveElement.id)

        this.elementsPositions[index].lastXTranslation = lastXTranslation
        this.elementsPositions[index].lastYTranslation = lastYTranslation

        this.stopFollowingPointer(element);

      }

    }
  }

  followPointer(element: HTMLElement, speed: number) {
    element.onpointermove = (e) => {}
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

      // if(e.deltaY > 0) {
      //   this.interactiveElement = document.getElementById("canvas2");
      // }else{
      //   this.interactiveElement = document.getElementById("interactiveElement");
      // }
      e.preventDefault();

      

      let currentScale = parseFloat(this.interactiveElement.style.scale);
      let equivalentSpeed = this.getEquivalentSpeed(speed, currentScale);

      let index = this.elements.indexOf(this.interactiveElement.id)
      
      this.zoom = this.elementsZooms[index].lastZoom;
      this.zoom += (e.deltaY * equivalentSpeed) / -(10000);

      if(this.zoom > maxZoom) {
        this.zoom = maxZoom;
      }else if(this.zoom < minZoom) {
        this.zoom = minZoom;
      }

      this.elementsZooms[index].lastZoom = this.zoom
      if(this.shareZoom){
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

  }

  removeZooming(element: HTMLElement) {
    element.onwheel = null;
  }

}
