import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IRating, IReply, IReplyPage, IThread, IUser } from 'src/app/model/model.interfaces';
import { AdminReplyDetailUnroutedComponent } from '../admin-reply-detail-unrouted/admin-reply-detail-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { UserReplyFormUnroutedComponent } from '../user-reply-form-unrouted/user-reply-form-unrouted.component';
import { UserThreadFormUnroutedComponent } from '../../thread/user-thread-form-unrouted/user-thread-form-unrouted.component';
import { UserReplyRatingFormUnroutedComponent } from '../user-reply-rating-form-unrouted/user-reply-rating-form-unrouted.component';
import { RatingAjaxService } from 'src/app/service/rating.service';


@Component({
  providers: [ConfirmationService],
  selector: 'app-user-reply-plist-unrouted',
  templateUrl: './user-reply-plist-unrouted.component.html',
  styleUrls: ['./user-reply-plist-unrouted.component.css']
})

export class UserReplyPlistUnroutedComponent implements OnInit {
  averageRatings: any = {};


  @Input()
  set id_user(value: number) {
    if (value) {
      this.id_user_filter = value;
    } else {
      this.id_user_filter = 0;
    }
    this.getPage();
  }
  get id_user(): number {
    return this.id_user_filter;
  }

  @Input()
  set id_thread(value: number) {
    if (value) {
      this.id_thread_filter = value;
      this.getThread();
    } else {
      this.id_thread_filter = 0;
    }
    this.getPage();
  }
  get id_thread(): number {
    return this.id_thread_filter;
  }

  @Output() reply_change = new EventEmitter<Boolean>();

  id_thread_filter: number = 0; //filter by thread
  id_user_filter: number = 0; //filter by thread

  oPage: IReplyPage | undefined;
  oUser: IUser | null = null; // data of user if id_user is set for filter
  oThread: IThread | null = null; // data of thread if id_thread is set for filter
  oReply: IReply | null = null; // data of user if id_user is set for filter
  orderField: string = "id";
  orderDirection: string = "desc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oReplyToRemove: IReply | null = null;

  constructor(
    private oRatingAjaxService: RatingAjaxService,
    private oUserAjaxService: UserAjaxService,
    public oSessionService: SessionAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
    private oReplyAjaxService: ReplyAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
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
    this.getPage();
    this.calculateAverageRatingsForAllReplies();
  }

  getPage(): void {
    this.oReplyAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user_filter, this.id_thread_filter).subscribe({
      next: (data: IReplyPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(this.oPaginatorState);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }

  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  ref: DynamicDialogRef | undefined;

  doView(u: IReply) {
    this.ref = this.oDialogService.open(AdminReplyDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'View of reply',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }

  doRemove(u: IReply) {
    this.oReplyToRemove = u;
    this.oConfirmationService.confirm({
      accept: () => {
        this.oMatSnackBar.open("The reply has been removed.", '', { duration: 2000 });
        this.oReplyAjaxService.removeOne(this.oReplyToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.reply_change.emit(true);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open("The reply hasn't been removed.", "", { duration: 2000 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMatSnackBar.open("The reply hasn't been removed.", "", { duration: 2000 });
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

  postNewReply(): void {
    if (this.id_thread_filter > 0 && this.oSessionService.isSessionActive()) {

      this.ref = this.oDialogService.open(UserReplyFormUnroutedComponent, {
        data: {
          id_thread: this.id_thread_filter,
        },
        header: 'Post a new reply',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });

      this.ref.onClose.subscribe((nReply: number) => {
        this.getPage();
        this.reply_change.emit(true);
      });
    }
  }

  postNewThread(): void {
    if (this.id_thread_filter > 0 && this.oSessionService.isSessionActive()) {

      this.ref = this.oDialogService.open(UserThreadFormUnroutedComponent, {
        data: {
          id_thread: this.id_thread_filter,
        },
        header: 'Post a new thread',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });

      this.ref.onClose.subscribe((nThread: number) => {
        this.getPage();
        this.reply_change.emit(true);
      });
    }
  }


  async postRatingReply(reply: IReply): Promise<void> {
    console.log('postRatingReply called');
    // Accede a las propiedades id de la respuesta actual
    const threadId = reply.thread.id;
    const replyId = reply.id;
    console.log(threadId);
    console.log(replyId);

    // Obtén el ID del usuario logueado
    try {
      const userId = await this.oSessionService.getUserId().toPromise();
      console.log(userId);

      if (userId !== null) {
        // Resto de tu lógica...
        const ref = this.oDialogService.open(UserReplyRatingFormUnroutedComponent, {
          data: {
            threadId: threadId,
            replyId: replyId,
            userId: userId,
          },
          header: 'Rate this reply',
          width: '40%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: false
        });

        ref.onClose.subscribe((result: IRating | undefined) => {
          if (result) {
            // La valoración se ha enviado correctamente, manejar según sea necesario
            console.log('Valoración exitosa', result);
          }
        });
      } else {
        console.error('No se pudo obtener el ID del usuario logueado');
      }
    } catch (error) {
      console.error('Error al obtener el ID del usuario logueado', error);
    }
  }

  calculateAverageRatingsForAllReplies(): void {
    console.log('calculateAverageRatingsForAllReplies called');
    this.oRatingAjaxService.getAverageRatingForAllReplies().subscribe(
      (averageMap: Map<number, number>) => {
        // Puedes hacer lo que necesites con el Map de medias
        console.log('Average Ratings:', averageMap);

        // Puedes asignar el Map de medias a la propiedad para mostrarlo en el HTML
        this.averageRatings = averageMap;
      },
      (error) => {
        console.error('Error obteniendo la media de las valoraciones:', error);
      }
    );
  }

  roundRating(rating: number | undefined): number {
    // Asegurarse de que la valoración no sea undefined
    if (rating === undefined) {
      return 0;
    }

    // Redondear la valoración al número entero más cercano
    return Math.round(rating);
  }
}