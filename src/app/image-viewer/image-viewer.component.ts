import { Component, OnInit } from '@angular/core';
import { ImageHandlerService } from '../image-handler.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  public currentImage: {
    name: string;
  };

  constructor(private imageHandler: ImageHandlerService) { }

  ngOnInit(): void {
    this.imageHandler.currentImage.subscribe(currentImage => this.currentImage = currentImage);
  }
}
