import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ImagePickerTableDataSource, ImagePickerTableItem } from './image-picker-table-datasource';

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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name'];

  ngOnInit() {
    this.dataSource = new ImagePickerTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  selectImage(row) {
    this.image = row;
    console.log(this.image);
  }
}