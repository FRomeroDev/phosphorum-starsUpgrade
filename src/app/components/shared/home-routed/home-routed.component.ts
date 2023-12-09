import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IThread } from 'src/app/model/model.interfaces';




@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.css']
})

export class HomeRoutedComponent implements OnInit {

  idThread: number = 0;
  reloadThreads: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onThreadChange(oThread: IThread) {
    this.idThread = oThread.id;
  }

  onReplyChange(bReply: Boolean) {
    this.reloadThreads.next(true);
  }

}





