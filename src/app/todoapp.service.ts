import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TodoListItem } from './todo-list-item.model';


@Injectable({
  providedIn: 'root'
})
export class TodoappService {

  constructor(private readonly firestore: AngularFirestore) { }

  getAllTodos() {
    return this.firestore.collection<TodoListItem>('todoapp')
  }
}
