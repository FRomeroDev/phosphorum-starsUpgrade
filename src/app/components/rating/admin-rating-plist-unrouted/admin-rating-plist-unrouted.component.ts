import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IRating, IRatingPage, IReply, IThread, IUser } from 'src/app/model/model.interfaces';
import { RatingAjaxService } from 'src/app/service/rating.service';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { AdminRatingDetailUnroutedComponent } from '../admin-rating-detail-unrouted/admin-rating-detail-unrouted.component';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-rating-plist-unrouted',
  templateUrl: './admin-rating-plist-unrouted.component.html',
  styleUrls: ['./admin-rating-plist-unrouted.component.css']
})
export class AdminRatingPlistUnroutedComponent implements OnInit {


  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_user: number = 0; //filter by user
  @Input() id_thread: number = 0; //filter by thread
  @Input() id_reply: number = 0; //filter by thread

  oPage: IRatingPage | undefined;
  oUser: IUser | null = null; // data of user if id_user is set for filter
  oThread: IThread | null = null; // data of thread if id_thread is set for filter
  oReply: IReply | null = null; // data of thread if id_thread is set for filter
  
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oRatingToRemove: IRating | null = null;

  constructor(
    private oUserAjaxService: UserAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
    private oReplyAjaxService: ReplyAjaxService,
    private oRatingAjaxService: RatingAjaxService,
    public oDialogService: DialogService,
    private oCconfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPage();
    if (this.id_user > 0) {
      this.getUser();
    }
    if (this.id_thread > 0) {
      this.getThread();
    }
    if (this.id_reply > 0) {
      this.getReply();
    }
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }

  getPage(): void {
    this.oRatingAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user, this.id_thread, this.id_reply).subscribe({
      next: (data: IRatingPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(this.oPaginatorState);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }

  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  doView(u: IRating) {
    let ref: DynamicDialogRef | undefined;
    ref = this.oDialogService.open(AdminRatingDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'View of rating',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }

  doRemove(u: IRating) {
    this.oRatingToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oMatSnackBar.open("The rating has been removed.", '', { duration: 2000 });
        this.oRatingAjaxService.removeOne(this.oRatingToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open("The rating hasn't been removed.", "", { duration: 2000 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMatSnackBar.open("The rating hasn't been removed.", "", { duration: 2000 });
      }
    });
  }

  getUser(): void {
    this.oUserAjaxService.getOne(this.id_user).subscribe({
      next: (data: IUser) => {
        this.oUser = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

  getThread(): void {
    this.oThreadAjaxService.getOne(this.id_thread).subscribe({
      next: (data: IThread) => {
        this.oThread = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

  getReply(): void {
    this.oReplyAjaxService.getOne(this.id_reply).subscribe({
      next: (data: IReply) => {
        this.oReply = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

}
