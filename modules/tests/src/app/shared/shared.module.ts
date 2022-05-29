import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DemoMaterialModule } from "../material-module";
import { PopoverDialogComponent } from "./popover-dialog/popover-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule
    ],
    declarations: [
        PopoverDialogComponent
    ],
    exports: [
        PopoverDialogComponent,
        DemoMaterialModule
    ]
})
export class SharedModule {}