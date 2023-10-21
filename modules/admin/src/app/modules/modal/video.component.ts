import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoComponent implements OnInit {
  videoUrl = ''

  constructor(
    public dialogRef: MatDialogRef<VideoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    const locale = localStorage.getItem('locale')

    if (locale === 'ru') {
      this.videoUrl = 'assets/videos/fitr.mp4'
    } else {
      this.videoUrl = 'assets/videos/fitr_en.mp4'
    }
  }

  onCancelClick() {
    this.dialogRef.close(null)
  }
}
