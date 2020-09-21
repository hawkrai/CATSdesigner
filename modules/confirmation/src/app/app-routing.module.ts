import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConfirmationComponent} from "./confirmation/confirmation.component";



const routes: Routes = [
  {path: '', redirectTo: '/page', pathMatch: 'full'},
  {path: "page", component: ConfirmationComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
