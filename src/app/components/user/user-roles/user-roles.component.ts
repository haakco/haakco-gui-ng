import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {InterfaceUser} from '../../../interfaces/InterfaceUser';
import {InterfaceStateApp} from '../../../reducers';

@Component({
             selector: 'app-user-roles',
             templateUrl: './user-roles.component.html',
             styleUrls: ['./user-roles.component.scss'],
           })
export class UserRolesComponent implements OnInit {

  _user: InterfaceUser;

  userRoles: string[] = [];
  availableRoles: string[] = [];

  @Input() set user(user: InterfaceUser) {
    if (user && user.roles) {
      this.userRoles = Object.values(user.roles);
    }
  };

  constructor(private store: Store<InterfaceStateApp>,
  ) {
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log([
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex,
                    this.availableRoles,
                    this.userRoles,
                  ]);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
