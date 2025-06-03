import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class PracticalPositionsService {
  private readonly STORAGE_KEY = 'receivedPracticalPositions'

  private _practicalPositions: number[] = []

  get practicalPositions(): number[] {
    return this._practicalPositions
  }

  set practicalPositions(positions: number[]) {
    this._practicalPositions = positions
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(positions))
  }

  loadFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY)
    this._practicalPositions = saved ? JSON.parse(saved) : []
  }

  clear(): void {
    this._practicalPositions = []
    localStorage.removeItem(this.STORAGE_KEY)
  }
}
