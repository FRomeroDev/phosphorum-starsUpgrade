import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IThread, IUser, formOperation } from 'src/app/model/model.interfaces';
import { AdminUserSelectionUnroutedComponent } from '../../user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';

@Component({
  selector: 'app-admin-thread-form-unrouted',
  templateUrl: './admin-thread-form-unrouted.component.html',
  styleUrls: ['./admin-thread-form-unrouted.component.css']
})

export class AdminThreadFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit

  threadForm!: FormGroup;
  oThread: IThread = { user: {} } as IThread;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private oThreadAjaxService: ThreadAjaxService,
    private router: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService
  ) {
    this.initializeForm(this.oThread);
  }

  initializeForm(oThread: IThread) {
    this.threadForm = this.formBuilder.group({
      id: [oThread.id],
      title: [oThread.title, [Validators.required, Validators.minLength(1), Validators.maxLength(2048)]],
      user: this.formBuilder.group({
        id: [oThread.user.id, Validators.required]
      })
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oThreadAjaxService.getOne(this.id).subscribe({
        next: (data: IThread) => {
          this.oThread = data;
          this.initializeForm(this.oThread);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open("Error reading thread from server.", '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oThread);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.threadForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.threadForm.valid) {
      if (this.operation === 'NEW') {
        this.oThreadAjaxService.newOne(this.threadForm.value).subscribe({
          next: (data: IThread) => {
            this.oThread = { "user": {} } as IThread;
            this.initializeForm(this.oThread); //el id se genera en el servidor
            this.oMatSnackBar.open('Thread has been created.', '', { duration: 2000 });
            this.router.navigate(['/admin', 'thread', 'view', data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Failed to create thread.', '', { duration: 2000 });
          }
        });
      } else {
        this.oThreadAjaxService.updateOne(this.threadForm.value).subscribe({
          next: (data: IThread) => {
            this.oThread = data;
            this.initializeForm(this.oThread);
            this.oMatSnackBar.open('Thread has been updated.', '', { duration: 2000 });
            this.router.navigate(['/admin', 'thread', 'view', this.oThread.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Failed to update thread.', '', { duration: 2000 });
          }
        });
      }
    }
  }

  onShowUsersSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'Select a User',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
      if (oUser) {
        this.oThread.user = oUser;
        this.threadForm.controls['user'].patchValue({ id: oUser.id })
      }
    });
  }

}
