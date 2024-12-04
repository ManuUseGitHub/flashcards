import { HttpHeaders } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { throwError } from 'rxjs';

const base = (url: string) =>
  (isDevMode() ? '' : 'https://luniversdemm.store/') + url;

const handleError = (error: any) => {
  if (error.status === 0) {
    console.error('There is an issue with the client or network:', error.error);
  } else {
    console.error('Server-side error:', error.error);
  }
  return throwError(
    () => new Error('Cannot retrieve data from the server. Please try again.')
  );
};

const standardOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

export { base, handleError, standardOptions };
