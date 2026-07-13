package com.midori.mos_backend.dto.pos;

/**
 * レジ（POS）向けAPIで、業務エラーをHTTPステータス・errorCode付きで表す例外
 *
 * OrderController がこれを捕捉し、PosErrorResponse に変換してPOSへ返す。
 */
public class PosApiException extends RuntimeException {

    private final int httpStatus;
    private final String errorCode;

    public PosApiException(int httpStatus, String errorCode, String message) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }

    public int getHttpStatus() { return httpStatus; }
    public String getErrorCode() { return errorCode; }
}
