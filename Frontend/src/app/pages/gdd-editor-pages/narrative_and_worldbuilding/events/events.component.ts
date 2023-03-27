import { Component } from '@angular/core';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  canvasParent:HTMLElement;
  currZoom = 1;

  constructor() {}

  lastMovingX = 0;
  lastMovingY = 0;

  ngOnInit() {

    this.canvasParent = document.getElementById("canvasContainer");
    
    this.addPanning(this.canvasParent, 1);
    this.addZooming(this.canvasParent, this.currZoom, 4, 20, 0);

  }

  getEquivalentSpeed(zoomSpeed: number, scale: number) {
    return scale * zoomSpeed;
  }

  addPanning(element: HTMLElement, speed: number) {

    let canvas = element.firstChild as HTMLElement;

    let lastXTranslation = 0;
    let lastYTranslation = 0;
    let xTranslation = 0;
    let yTranslation = 0;

    element.onpointerdown = (e) => {

      element.style.cursor = "grabbing";

      let offX = e.x;
      let offY = e.y;

      let movingX = 0;
      let movingY = 0;

      element.onpointermove = (e) => {

        element.style.cursor = "grabbing";
        movingX = e.x;
        movingY = e.y;

        let currentCanvasScale = parseFloat(canvas.style.scale);

        xTranslation = ( ( ( (movingX - offX) ) * 1/currentCanvasScale ) * speed);
        yTranslation = ( ( ( (movingY - offY) ) * 1/currentCanvasScale ) * speed);

        canvas.style.transform = `translate(${lastXTranslation + xTranslation}px, ${lastYTranslation + yTranslation}px)`;

      }

      element.onpointerup = (e) => {

        element.style.cursor = "initial";
        lastXTranslation = lastXTranslation + xTranslation;
        lastYTranslation = lastYTranslation + yTranslation;
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

  addZooming(element: HTMLElement, zoom: number, speed: number, maxZoom: number = 7.5, minZoom: number = 0) {
    let canvas = element.firstChild as HTMLElement;
    canvas.style.scale = "1";

    element.onwheel = (e) => {

      e.preventDefault();

      let canvas = element.firstChild as HTMLElement;
      let currentScale = parseFloat(canvas.style.scale);

      let equivalentSpeed = this.getEquivalentSpeed(speed, currentScale);
      
      zoom += (e.deltaY * equivalentSpeed) / -(10000);

      if(zoom > maxZoom) {
        zoom = maxZoom;
      }else if(zoom < minZoom) {
        zoom = minZoom;
      }

      canvas.style.scale = zoom.toString();

    }

  }

  removeZooming(element: HTMLElement) {
    element.onwheel = null;
  }

}
