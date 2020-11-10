import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ImagePickerTableDataSource, ImagePickerTableItem } from './image-picker-table-datasource';
import { ImageHandlerService } from '../image-handler.service';

@Component({
  selector: 'app-image-picker-table',
  templateUrl: './image-picker-table.component.html',
  styleUrls: ['./image-picker-table.component.scss']
})
export class ImagePickerTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ImagePickerTableItem>;
  dataSource: ImagePickerTableDataSource;
  private image: any;
  currentImage: string;
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name'];
  
    constructor(private imageHandler: ImageHandlerService) { }

  ngOnInit() {
    this.dataSource = new ImagePickerTableDataSource();
    this.imageHandler.currentImage.subscribe(currentImage => this.currentImage = currentImage);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  selectImage(selectedImage: object) {
    this.image = selectedImage;
    this.imageHandler.newSelectedImage(this.image);
  }
}
