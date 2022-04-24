import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FilterPipe } from "./pipes/filter.pipe";

@NgModule({
    declarations: [FilterPipe],
    imports: [CommonModule],
    exports: [FilterPipe]
})
export class SharedModule {}