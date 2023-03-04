import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  SortableHeaderDirective,
  SortEvent,
  compare,
} from './sortable.header.directive';

export interface Project {
  name: string;
  lastUpdated: string;
  owner: string;
} 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tableMode: string = 'My Projects';
  Projects: Project[];
  data: Project[];
  tableFilter: String;

  MyProjectsData: Project[] = [
    {
      name: "Argon 4",
      lastUpdated: "2020-01-03",
      owner: ""
    },
    {
      name: "Argon 1",
      lastUpdated: "2020-01-01",
      owner: ""
    },
    {
      name: "Argon 2",
      lastUpdated: "2020-01-02",
      owner: ""
    },
    {
      name: "Argon 3",
      lastUpdated: "2020-01-03",
      owner: ""
    },
    
  ]
  
  SharedProjectsData: Project[] = [
    {
      name: "Argon 4",
      lastUpdated: "2020-01-04",
      owner: "abiasdsasdelpg1@gmail.com"
    },
    {
      name: "Argon 5",
      lastUpdated: "2020-01-05",
      owner: "abiasdsasdelpg2@gmail.com"
    },
    {
      name: "Argon 6",
      lastUpdated: "2020-01-06",
      owner: "abiasdsasdelpg3@gmail.com"
    }
  ]

  ngOnInit() {
    this.tableMode = 'My Projects';
    this.Projects = this.MyProjectsData;
    this.data = this.Projects;
  }

  toggleTable() {
    if (this.tableMode == 'My Projects') {
      this.tableMode = 'Shared Projects';
      this.Projects = this.SharedProjectsData;
    } else if (this.tableMode == 'Shared Projects') {
      this.tableMode = 'My Projects';
      this.Projects = this.MyProjectsData;
    }
    this.data = this.Projects;
  }

  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.Projects = this.data;
    } else {
      this.Projects = [...this.data].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}


