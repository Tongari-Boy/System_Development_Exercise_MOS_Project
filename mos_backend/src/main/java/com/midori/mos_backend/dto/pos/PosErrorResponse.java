package com.midori.mos_backend.dto.pos;

/**
 * レジ（POS）向けのエラーレスポンス
 *
 * POS側（regi）の MosClient は、失敗時のボディから errorCode / message を読み取る。
 * 主なerrorCode:
 *   INVALID_REQUEST : リクエストが不正
 *   NOT_FOUND       : 該当する注文が存在しない
 *   HASH_MISMATCH   : hashが一致しない（注文内容が変更されている）
 */
public class PosErrorResponse {

    private final String errorCode;
    private final String message;

    public PosErrorResponse(String errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    public String getErrorCode() { return errorCode; }
    public String getMessage() { return message; }
}
