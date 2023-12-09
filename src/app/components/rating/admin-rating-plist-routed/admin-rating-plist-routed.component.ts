import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { RatingAjaxService } from 'src/app/service/rating.service';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-rating-plist-routed',
  templateUrl: './admin-rating-plist-routed.component.html',
  styleUrls: ['./admin-rating-plist-routed.component.css']
})
export class AdminRatingPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  id_user: number;
  id_thread: number;
  id_reply: number;
  bLoading: boolean = false;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oRatingAjaxService: RatingAjaxService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar
  ) {
    this.id_user = parseInt(this.oActivatedRoute.snapshot.paramMap.get("iduser") ?? "0");
    this.id_thread = parseInt(this.oActivatedRoute.snapshot.paramMap.get("idthread") ?? "0");
    this.id_reply = parseInt(this.oActivatedRoute.snapshot.paramMap.get("idreply") ?? "0");
  }

  ngOnInit() { }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.oRatingAjaxService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {
        this.oMatSnackBar.open("Now there are " + oResponse + " ratings", '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMatSnackBar.open("Error generating ratings: " + oError.message, '', { duration: 2000 });
        this.bLoading = false;
      },
    })
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Are you sure that you want to remove all the ratings?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.oRatingAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open("Now there are " + oResponse + " ratings", '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open("Error emptying ratings: " + oError.message, '', { duration: 2000 });
            this.bLoading = false;
          },
        })
      },
      reject: () => {
        this.oMatSnackBar.open("Empty Cancelled!", '', { duration: 2000 });
      }
    });
  }


}
