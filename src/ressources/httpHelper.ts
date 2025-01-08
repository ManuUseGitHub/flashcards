import { HttpHeaders } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';

console.log('it is mode debug :' + isDevMode());
const base = (url: string, isApiCall: boolean = true) => {
  return (isDevMode() ? '' : `https://api.luniversdemm.store/`) + url;
};

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
    Authorization: 'Bearer ' + environment.accessToken,
  }),
};

export { base, handleError, standardOptions };
