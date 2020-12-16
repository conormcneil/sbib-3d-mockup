import { Component, OnInit } from '@angular/core';
import { ImageHandlerService } from '../image-handler.service';
import Image from '../models/Image';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  public currentImage: Image;
  public previewType: string;

  constructor(private imageHandler: ImageHandlerService) {
    this.previewType = 'frame';
  }

  ngOnInit(): void {
    this.imageHandler.currentImage.subscribe(currentImage => this.currentImage = currentImage);
  }

  imagePath(): string {
    return `http://localhost:8000/${this.previewType}/png/`;
  }

  previewImagePath(): string {
    return this.imagePath() + this.currentImage.imageName + '.png';
  }

  previewImageAltText(): string {
    const type = this.previewType == 'frame' ? 'Frame' : 'Map';
    return `${type} projected image`;
  }

  setPreviewType(previewType: string): void {
    this.previewType = previewType;
  }
}
