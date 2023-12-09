import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IRating } from 'src/app/model/model.interfaces';
import { RatingAjaxService } from 'src/app/service/rating.service';

@Component({
  selector: 'app-admin-rating-detail-unrouted',
  templateUrl: './admin-rating-detail-unrouted.component.html',
  styleUrls: ['./admin-rating-detail-unrouted.component.css']
})
export class AdminRatingDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oRating: IRating = { user: {}, thread: {}, reply: {} } as IRating; 
  status: HttpErrorResponse | null = null;

  constructor(
    private oRatingAjaxService: RatingAjaxService,
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
    this.oRatingAjaxService.getOne(this.id).subscribe({
      next: (data: IRating) => {
        this.oRating = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

}
