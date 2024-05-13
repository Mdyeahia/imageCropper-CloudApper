import { Component, ViewChild, ElementRef } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('webcamElement') webcamElement?: ElementRef<HTMLVideoElement>;
  trigger: Subject<any> = new Subject();
  isWebcamOn: boolean = false;
  webcamImage: any = '';
  sysImage = '';
  imageChangedEvent: any;
  croppedImage: any = '';


  toggleWebcam(): void {
    this.isWebcamOn = !this.isWebcamOn;
    if (this.isWebcamOn) {
      this.startWebcam();
    } else {
      this.stopWebcam();
      this.webcamImage = '';
    }
  }

  startWebcam(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (this.webcamElement) {
          this.webcamElement.nativeElement.srcObject = stream;
        }
      })
      .catch((err) => console.error('Error starting webcam:', err));
  }

  stopWebcam(): void {
    if (this.webcamElement && this.webcamElement.nativeElement.srcObject) {
      const stream = this.webcamElement.nativeElement.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      this.webcamElement.nativeElement.srcObject = null;
    }
  }

  public captureImg(webcamImage: WebcamImage): void {

    this.webcamImage = webcamImage;
  }

  public getSnapshot(): void {
    this.trigger.next(void 0);
  }


  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
  }
  saveImageToDesktop() {
    const link = document.createElement('a');
    link.href = this.croppedImage;
    link.download = 'cropped_image.jpeg';
    link.click();
  }
}
