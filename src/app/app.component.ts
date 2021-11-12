import { Component, ViewChild } from '@angular/core';
import { RecordRTCPromisesHandler } from "recordrtc";
import { saveAs } from "file-saver";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  interval: any
  title = 'media';
  recorder!: RecordRTCPromisesHandler
  video!: any
  stream!: MediaStream
  @ViewChild('videoElement', { static: true }) videoEle: any;

  async startVideoRecording() {
    console.log("started");
    this.video = undefined
    this.video = this.videoEle.nativeElement;
    const browser = <any>navigator;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      this.recorder = new RecordRTCPromisesHandler(this.stream, {
        type: "video"
      });
      await this.recorder.startRecording();
      // browser.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream: MediaSource) => {
      //   this.video.srcObject = stream
      //   this.video.play();
      // });
    } catch (error) {
      console.log("error");
    }
  }

  async stopVideoRecording() {

    await this.recorder.stopRecording();
    // this.video.srcObject = null
    this.stream.getTracks().forEach(track => {
      track.stop()
    })
    let blob = await this.recorder.getBlob();
    saveAs(blob, "blob.mp4")
    await this.recorder.destroy()

    console.log("ended");
  }
}
