import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VideoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VideoComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any ) { }


  ngOnInit() {
  }

  onCancelClick() {
    this.dialogRef.close(null);
  }
}
