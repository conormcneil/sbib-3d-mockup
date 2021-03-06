import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ImagePickerTableDataSource } from './image-picker-table-datasource';
import Image from '../modules/Image';
import { ImageHandlerService } from '../image-handler.service';

@Component({
  selector: 'app-image-picker-table',
  templateUrl: './image-picker-table.component.html',
  styleUrls: ['./image-picker-table.component.scss']
})
export class ImagePickerTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Image>;
  dataSource: ImagePickerTableDataSource;
  private image: any;
  currentImage: {
    id: number;
    target: string;
    name: string;
    url: string;
  };
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name'];
  
  constructor( private imageHandler: ImageHandlerService ) {}

  ngOnInit(): void {
    this.dataSource = new ImagePickerTableDataSource();
    this.imageHandler.currentImage.subscribe(currentImage => this.currentImage = currentImage);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  selectImage(selectedImage: object): void {
    this.image = selectedImage;
    this.imageHandler.newSelectedImage(this.image);
  }

  selected(id: number): string {
    return id === this.currentImage.id ? 'selected' : null;
  }
}
