import { Component, ViewChild, ElementRef } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
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

    Swal.fire({
      title: "Save Image",
      text: "Would you like to save the image as a PDF or Image?",
      showCancelButton: true,
      confirmButtonText: "PDF",
      cancelButtonText: "Image"
    }).then((result) => {

      if (result.isConfirmed) {

        this.saveAsPdf();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        this.saveAsJpeg();
      }
    });
  }


  private saveAsJpeg() {

    const link = document.createElement('a');
    link.href = this.croppedImage;
    link.download = 'cropped_image.jpeg';
    link.click();
  }

  private saveAsPdf() {
    const doc = new jsPDF();
    doc.addImage(this.croppedImage, 'JPEG', 10, 10, 100, 100);
    doc.save('cropped_image.pdf');
  }
}
