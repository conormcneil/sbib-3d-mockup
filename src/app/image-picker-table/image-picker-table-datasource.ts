import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import SbibImage from '../models/SbibImage';
import { HttpClient } from '@angular/common/http';

/**
 * Data source for the ImagePickerTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ImagePickerTableDataSource extends DataSource<SbibImage> {
  data: SbibImage[] = [];
  paginator: MatPaginator;
  sort: MatSort;
  subject: BehaviorSubject<SbibImage[]> = new BehaviorSubject<SbibImage[]>([]);
  private loadingImages: boolean = false;

  constructor(private httpClient: HttpClient) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<SbibImage[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    if (this.data.length < 1) {
      this.getAllImages().then(response => {
        this.data = response;
        this.subject.next(this.data);
        const dataMutations = [
          observableOf(this.data),
          this.paginator.page,
          this.sort.sortChange
        ];
    
        return merge(...dataMutations).pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        }));
      });
    } else {
      const dataMutations = [
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ];
  
      return merge(...dataMutations).pipe(map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      }));
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: SbibImage[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: SbibImage[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.imageName, b.imageName, isAsc);
        // case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }

  getAllImages(): Promise<SbibImage[]> {
    return this.httpClient.get<SbibImage[]>('http://localhost:9494/images/all/2').toPromise();
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
