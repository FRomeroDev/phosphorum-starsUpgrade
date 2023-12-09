import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IRating, IReply, IThread, IUser, formOperation } from 'src/app/model/model.interfaces';
import { RatingAjaxService } from 'src/app/service/rating.service';
import { CALENDAR_ES } from 'src/environment/environment';
import { AdminUserSelectionUnroutedComponent } from '../../user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { AdminThreadSelectionUnroutedComponent } from '../../thread/admin-thread-selection-unrouted/admin-thread-selection-unrouted.component';
import { AdminReplySelectionUnroutedComponent } from '../../reply/admin-reply-selection-unrouted/admin-reply-selection-unrouted.component';

@Component({
  selector: 'app-admin-rating-form-unrouted',
  templateUrl: './admin-rating-form-unrouted.component.html',
  styleUrls: ['./admin-rating-form-unrouted.component.css']
})
export class AdminRatingFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; // new or edit

  es = CALENDAR_ES;

  ratingForm!: FormGroup;
  oRating: IRating = { created_at: new Date(Date.now()), user: {}, thread: {}, reply: {} } as IRating;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private oRatingAjaxService: RatingAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    public oDialogService: DialogService
  ) {
    this.initializeForm(this.oRating);
  }

  initializeForm(oRating: IRating) {
    this.ratingForm = this.formBuilder.group({
      id: [oRating.id],
      user: this.formBuilder.group({
        id: [oRating.user.id, [Validators.required, Validators.pattern(/^\d*$/)]],
      }),
      thread: this.formBuilder.group({
        id: [oRating.thread.id, Validators.required]
      }),
      reply: this.formBuilder.group({
        id: [oRating.reply.id, Validators.required]
      }),
      rating: [oRating.stars, [Validators.required, Validators.pattern('[1-5]')]],
      created_at: [new Date(oRating.created_at)]
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oRatingAjaxService.getOne(this.id).subscribe({
        next: (data: IRating) => {
          this.oRating = data;
          this.initializeForm(this.oRating);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.matSnackBar.open("Error reading rating from server.", '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.oRating);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.ratingForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.ratingForm.valid) {
      if (this.operation == 'NEW') {
        this.oRatingAjaxService.newOne(this.ratingForm.value).subscribe({
          next: (data: IRating) => {
            this.oRating = { "user": {}, "thread": {}, "reply": {} } as IRating;
            this.initializeForm(this.oRating);
            this.matSnackBar.open("Rating has been created.", '', { duration: 2000 });
            this.router.navigate(['/admin', 'rating', 'view', data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open("Can't create rating.", '', { duration: 2000 });
          }
        });
      } else {
        this.oRatingAjaxService.updateOne(this.ratingForm.value).subscribe({
          next: (data: IRating) => {
            this.oRating = data;
            this.initializeForm(this.oRating);
            this.matSnackBar.open("Rating has been updated.", '', { duration: 2000 });
            this.router.navigate(['/admin', 'rating', 'view', this.oRating.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open("Can't update reply.", '', { duration: 2000 });
          }
        });
      }
    }
  }

  onShowUsersSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'Select an User',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
      if (oUser) {
        this.oRating.user = oUser;
        this.ratingForm.controls['user'].patchValue({ id: oUser.id })
      }
    });
  }

  onShowThreadsSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminThreadSelectionUnroutedComponent, {
      header: 'Select a Thread',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((oThread: IThread) => {
      if (oThread) {
        this.oRating.thread = oThread;
        this.ratingForm.controls['thread'].patchValue({ id: oThread.id })
      }
    });
  }

  onShowRepliesSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminReplySelectionUnroutedComponent, {
      header: 'Select a Reply',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((oReply: IReply) => {
      if (oReply) {
        this.oRating.reply = oReply;
        this.ratingForm.controls['reply'].patchValue({ id: oReply.id })
      }
    });
  }

}
