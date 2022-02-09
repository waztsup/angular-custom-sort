import { Component, VERSION } from '@angular/core';
import { books } from './books';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import moment = require('moment');

interface SortOption {
  fieldName: string;
  fieldKey: string;
  type: string;
  sortDir: 'asc' | 'desc';
  selected?: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public list: any = books;
  public sort: SortOption[] = [
    {
      fieldName: 'Author',
      fieldKey: 'author',
      type: 'string',
      sortDir: 'asc',
    },
    {
      fieldName: 'Series',
      fieldKey: 'series',
      type: 'string',
      sortDir: 'asc',
    },
    {
      fieldName: 'Index',
      fieldKey: 'index',
      type: 'number',
      sortDir: 'asc',
    },
    {
      fieldName: 'Title',
      fieldKey: 'title',
      type: 'string',
      sortDir: 'asc',
    },
    {
      fieldName: 'Date read',
      fieldKey: 'dateAdded',
      type: 'date',
      selected: true,
      sortDir: 'desc',
    },
  ];

  compareNumbers(a, b, dir): number {
    return a > b ? dir : a < b ? -dir : 0;
  }

  /*
   *
   * Method adapted from
   * https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
   * Support for different data types was added in.
   *
   */
  resort(): void {
    this.list = this.list.sort((a, b) =>
      this.sort
        .map((option) => {
          if (!option.selected) {
            return 0;
          }
          const key = option.fieldKey;
          let dir = 1;
          if (option.sortDir === 'desc') {
            dir = -1;
          }
          switch (option.type) {
            case 'date':
              return this.compareNumbers(
                moment(a[key]).unix(),
                moment(b[key]).unix(),
                dir
              );
            case 'string':
              return a[key].localeCompare(b[key]) * dir;
            case 'number':
              return this.compareNumbers(a[key], b[key], dir);
          }
        })
        .reduce((current, next) => (current ? current : next), 0)
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sort, event.previousIndex, event.currentIndex);
    this.resort();
  }
}
