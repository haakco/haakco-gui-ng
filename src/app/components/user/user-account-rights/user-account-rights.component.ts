import {Component, Input, OnInit} from '@angular/core';
import {InterfaceUser} from '../../../interfaces/InterfaceUser';

@Component({
  selector: 'app-user-account-rights',
  templateUrl: './user-account-rights.component.html',
  styleUrls: ['./user-account-rights.component.scss']
})
export class UserAccountRightsComponent implements OnInit {

  @Input() user: InterfaceUser;

  constructor() { }

  ngOnInit() {
  }

}
