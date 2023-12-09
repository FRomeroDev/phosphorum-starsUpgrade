import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IReply } from 'src/app/model/model.interfaces';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';

@Component({
  selector: 'app-user-reply-detail-unrouted',
  templateUrl: './user-reply-detail-unrouted.component.html',
  styleUrls: ['./user-reply-detail-unrouted.component.css']
})

export class UserReplyDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oReply: IReply = { user: {}, thread: {} } as IReply;
  status: HttpErrorResponse | null = null;

  constructor(
    private oReplyAjaxService: ReplyAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
  }

  ngOnInit() {
    this.getOne();
  }

  getOne(): void {
    this.oReplyAjaxService.getOne(this.id).subscribe({
      next: (data: IReply) => {
        this.oReply = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

}
