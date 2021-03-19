import { Injectable } from '@angular/core';
import { ApiErrorCodes, ErrorModel } from '../models';

@Injectable()
export class ApiExceptionHandlerService {
    private noToasterErrorCodes = [
        ApiErrorCodes.CHANGE_REQUEST_NOTE_ERROR,
        ApiErrorCodes.DATE_NOT_EDITABLE,
        ApiErrorCodes.DATE_INVALID_FUTURE,
        ApiErrorCodes.DATE_INVALID_PAST,
        ApiErrorCodes.DATE_INVALID_RODATE,
    ];

    public handle(error: ErrorModel) {
        if (this.noToasterErrorCodes.includes(error.errorCode)) {
            throw error;
        }
    }
}
