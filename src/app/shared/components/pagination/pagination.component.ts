import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'cs-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

  @Input() data = [];
  @Output() onPageChanged = new EventEmitter();

  pageSizeOptions = [
    { caption: '10', value: 10 },
    { caption: '15', value: 15 },
    { caption: '30', value: 30 }
  ];

  pageNumber = 0;
  pageItemCount = 10;
  pageItems = [];

  constructor() { }

  ngOnChanges() {
    this.pageItems = this.pageSlice(this.pageNumber);
    this.emitPageChangeEvent();
  }

  getSelected() {
    let count = this.data.reduce((prev, current) => {
      if (current.selected) {
        return ++prev;
      }
      return prev;
    }, 0);
    return count;
  }

  firstPage() {
    this.pageNumber = 0;
    this.pageItems = this.pageSlice();
    this.emitPageChangeEvent();
  }

  nextPage() {
    this.pageNumber++;
    this.pageItems = this.pageSlice(this.pageNumber);
    this.emitPageChangeEvent();
  }

  previousPage() {
    this.pageNumber--;
    this.pageItems = this.pageSlice(this.pageNumber);
    this.emitPageChangeEvent();
  }

  lastPage() {
    this.pageNumber = this.maxPageNumber() - 1;
    this.pageItems = this.pageSlice(this.pageNumber);
    this.emitPageChangeEvent();
  }

  pageSizeSelected(data) {
    this.pageNumber = 0;
    this.pageItemCount = +data.selected;
    this.pageItems = this.pageSlice(this.pageNumber);
    this.emitPageChangeEvent();
  }

  isFirstPage() {
    return this.pageNumber === 0;
  }

  isLastPage() {
    return this.pageNumber >= this.maxPageNumber() - 1;
  }

  getPageCaption() {
    return `${ this.pageStartNumber() } - ${ this.pageLastNumber() } of ${ this.data.length }`;
  }

  pageSlice(pageNumber = 0) {
    return this.data.slice(this.pageItemCount * pageNumber, this.pageItemCount * (pageNumber + 1));
  }

  private pageStartNumber() {
    return this.pageNumber * this.pageItemCount;
  }

  private pageLastNumber() {
    const last = this.pageStartNumber() + this.pageSlice().length;
    return last > this.data.length ? this.data.length : last;
  }

  private emitPageChangeEvent() {
    this.onPageChanged.emit({
      pageItems: this.pageItems
    });
  }

  private maxPageNumber() {
    if (this.pageItemCount > this.data.length) {
      return 0;
    }
    return Math.ceil(this.data.length / this.pageItemCount);
  }

}
