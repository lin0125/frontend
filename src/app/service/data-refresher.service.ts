import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subject, Subscription, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataRefresherService {
  private subjects = new Map<string, Subject<void>>();

  watch(key: string, callback: () => void): void {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new Subject<void>());
    }
    this.subjects.get(key)!.subscribe(() => callback());
  }

  trigger(key: string): void {
    this.subjects.get(key)?.next();
  }

  startInterval(key: string, callback: () => void, intervalMs = 10000): void {
    this.watch(key, callback);
    timer(0, intervalMs).subscribe(() => this.trigger(key));
  }
}