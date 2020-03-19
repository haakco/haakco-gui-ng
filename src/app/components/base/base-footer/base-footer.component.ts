import { Component, OnInit } from '@angular/core';
import {ConstantAppConfig} from '../../../constants/ConstantAppConfig';

@Component({
  selector: 'app-base-footer',
  templateUrl: './base-footer.component.html',
  styleUrls: ['./base-footer.component.scss']
})
export class BaseFooterComponent implements OnInit {

  constantAppConfig = ConstantAppConfig;

  today: number = Date.now();

  constructor() { }

  ngOnInit() {
  }

}
