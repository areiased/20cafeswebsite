import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

@Component({
  selector: 'app-shoppage',
  templateUrl: './shoppage.component.html',
  styleUrls: ['./shoppage.component.scss']
})
export class ShoppageComponent implements OnInit {

  constructor(private db: AngularFireDatabase) {

   }

  ngOnInit(): void {
    
  }

}
