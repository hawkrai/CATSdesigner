import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslatePipe } from "../pipe/translate.pipe";

@NgModule({
    declarations: [
        TranslatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TranslatePipe
    ],
    providers: [
        TranslatePipe
    ]
})
export class SharedModule {}