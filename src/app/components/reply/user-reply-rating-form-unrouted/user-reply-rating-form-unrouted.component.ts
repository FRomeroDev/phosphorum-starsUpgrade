import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IRating, IReply, IThread, IUser, formOperation } from 'src/app/model/model.interfaces';
import { RatingAjaxService } from 'src/app/service/rating.service';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-user-reply-rating-form-unrouted',
  templateUrl: './user-reply-rating-form-unrouted.component.html',
  styleUrls: ['./user-reply-rating-form-unrouted.component.css']
})
export class UserReplyRatingFormUnroutedComponent implements OnInit {


  threadId: number | undefined;
  replyId: number | undefined;
  userId: number | undefined;  // Haz que userId sea opcional
  user: IUser | undefined;    // Inicializa user como undefined
  thread: IThread | undefined;    // Inicializa user como undefined
  reply: IReply | undefined;    // Inicializa user como undefined

  status: HttpErrorResponse | null = null;
  oRating: IRating = { user: { id: 0 }, thread: { id: 0 }, reply: { id: 0 }, stars: 1, created_at: new Date(Date.now()) } as IRating;
  starSelected: boolean = false;
  ratingForm!: FormGroup;
  operation: formOperation = 'NEW'; // new or edit
  config: any;

  constructor(
    private formBuilder: FormBuilder,
    private oRatingAjaxService: RatingAjaxService,
    private oUserAjaxService: UserAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
    private oReplyAjaxService: ReplyAjaxService,
    private matSnackBar: MatSnackBar,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
    public oDynamicDialogConfig: DynamicDialogConfig
  ) {
    this.userId = this.oDynamicDialogConfig.data.userId;
    this.threadId = this.oDynamicDialogConfig.data.threadId;
    this.replyId = this.oDynamicDialogConfig.data.replyId;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.ratingForm.controls[controlName].hasError(errorName);
  }

  ngOnInit() {
    if (this.userId !== undefined) {
      this.oUserAjaxService.getOne(this.userId).subscribe((user: IUser) => {
        this.user = user;
      });
    }
    if (this.threadId !== undefined) {

      this.oThreadAjaxService.getOne(this.threadId).subscribe((thread: IThread) => {
        this.thread = thread;
      });
    }
    if (this.replyId !== undefined) {

      this.oReplyAjaxService.getOne(this.replyId).subscribe((reply: IReply) => {
        this.reply = reply;
      });
    }
    // Obtener datos del diálogo
    this.initializeForm(this.oRating);

    this.ratingForm.valueChanges.subscribe(() => {
      console.log('Formulario válido:', this.ratingForm.valid);
      this.starSelected = this.ratingForm.valid;
      console.log("starSelected:", this.starSelected);
    });

  }


  initializeForm(oRating: IRating) {
    this.ratingForm = this.formBuilder.group({
      id: [oRating.id],
      user: this.formBuilder.group({
        id: [this.userId],
      }),
      thread: this.formBuilder.group({
        id: [this.threadId]
      }),
      reply: this.formBuilder.group({
        id: [this.replyId]
      }),
      stars: [oRating.stars, [Validators.required, Validators.min(1), Validators.max(5)]],
      created_at: [new Date(oRating.created_at)]
    });
  }

  /*
    onSubmit() {
      console.log("Formulario válido:", this.ratingForm.valid);
      console.log("starSelected:", this.starSelected);
      if (this.ratingForm.valid && this.starSelected) {
        console.log("Formulario válido:", this.ratingForm.value);
        const ratingData = this.ratingForm.value;
        console.log("no hace nada2");
  
        if (this.operation === 'NEW') {
          console.log("no hace nada3");
          this.oRatingAjaxService.newOne(ratingData).subscribe({
            next: (data: IRating) => {
              this.matSnackBar.open("Rating has been published.", '', { duration: 2000 });
              this.oDynamicDialogRef.close(data);
            },
            error: (error: HttpErrorResponse) => {
              this.status = error;
              this.matSnackBar.open("Can't publish rating.", '', { duration: 2000 });
            }
          });
        } else if (this.operation === 'EDIT') {
          console.log("no hace nada3");
          this.oRatingAjaxService.updateOne(ratingData).subscribe({
            next: (data: IRating) => {
              this.oRating = data;
              this.initializeForm(this.oRating);
              this.matSnackBar.open("Reply has been updated.", '', { duration: 2000 });
              this.oDynamicDialogRef.close(data);
            },
            error: (error: HttpErrorResponse) => {
              this.status = error;
              this.matSnackBar.open("Can't update reply.", '', { duration: 2000 });
            }
          });
        }
      }
    }
  */
  onSubmit() {
    console.log('onSubmit called');
    // Obtener los datos de la valoración del formulario
    const ratingData = this.ratingForm.value;

    // Verificar si es una nueva valoración o una actualización
    const isUpdate = ratingData.id !== undefined && ratingData.id !== null;

    // Llamar al servicio para verificar la existencia de la valoración
    this.oRatingAjaxService.rateReply(ratingData).subscribe({
      next: (data: IRating) => {
        // La valoración se ha creado o actualizado correctamente
        if (!isUpdate) {
          this.matSnackBar.open("Rating has been published.", '', { duration: 2000 });
          console.log("Nuevo");
        } else {
          this.matSnackBar.open("Rating has been updated.", '', { duration: 2000 });
          console.log("Edita");
        }
        this.oDynamicDialogRef.close(data);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
        this.matSnackBar.open("Error submitting rating.", '', { duration: 2000 });
      }
    });
  }



  canCancel(): boolean {
    return this.ratingForm.valid;
  }

  onCancel() {
    this.oDynamicDialogRef.close(); // Cierra el formulario sin guardar cambios
  }


  onStarSelect(stars: number) {
    // Actualiza la variable starSelected basándote en si se ha seleccionado al menos una estrella
    this.starSelected = stars > 0;
    console.log('Estrellas seleccionadas:', stars);
  }
}
