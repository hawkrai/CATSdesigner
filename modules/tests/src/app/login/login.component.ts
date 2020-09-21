import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private apiService : ApiService) { }

  ngOnInit() {
    localStorage.setItem("currentUser",JSON.stringify({id:10031,role:"lector", userName:"popova"}));
    localStorage.setItem("currentSubject",JSON.stringify({id: "3", Name:"Тестирование ПО"}));
    localStorage.setItem("locale","rus");
    this.apiService.login().subscribe((res)=>{
      console.log(res);
    })
  }

}
