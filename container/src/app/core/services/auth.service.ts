import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, throwError, Observable } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { User } from './../models/user'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>
  public currentUser: Observable<User>

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value
  }

  setCurrentUserValue(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user))
    this.currentUserSubject.next(user)
  }

  login(username, password) {
    return this.http
      .post<any>(`/Account/LoginJWT`, {
        userName: username,
        password,
      })
      .pipe(
        map((user) => {
          this.setCurrentUserValue(user)
          return user
        }),
        catchError((error) => {
          console.log(error)
          return throwError(error)
        })
      )
  }

  check() {
    return this.http.get<any>('/Account/UserSessionCheck')
  }

  logout() {
    return this.http.get<any>('/Account/LogOff').pipe(
      map((user) => {
        localStorage.removeItem('currentUser')
        this.currentUserSubject.next(null)
      })
    )
  }
}
