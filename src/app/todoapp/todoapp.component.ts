import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { TodoListItem } from '../todo-list-item.model';
import { TodoappService } from '../todoapp.service';

@Component({
  selector: 'app-todoapp',
  templateUrl: './todoapp.component.html',
  styleUrls: ['./todoapp.component.scss']
})
export class TodoappComponent implements OnInit {

  constructor(
              private toastr: ToastrService,
              private firestore: AngularFirestore,
              private firestorage: AngularFireStorage,
              public authService: AuthService,
  ) {}

  ngOnInit(): void {
  }



}
