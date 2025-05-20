import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LabPositionsService {
  private readonly STORAGE_KEY = 'receivedLabPositions';

  private _labPositions: number[] = [];
 
  get labPositions(): number[] {
    return this._labPositions;
  }

  set labPositions(positions: number[]) {
    this._labPositions = positions;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(positions));
  }

  loadFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this._labPositions = saved ? JSON.parse(saved) : [];
  }

  clear(): void {
    this._labPositions = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}