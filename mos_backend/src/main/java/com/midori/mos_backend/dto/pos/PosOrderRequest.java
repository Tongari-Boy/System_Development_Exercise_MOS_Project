package com.midori.mos_backend.dto.pos;

/**
 * レジ（POS）から POST /api/orders に届くRPCリクエスト
 *
 * POS側（regi）の MosClient / MosOrdersApi は、単一エンドポイントに対して
 * method フィールドで処理を振り分ける方式で通信してくる。
 *   method="getOrders"    → 注文取得（customerId/billStatus/fromTime/toTime で絞り込み）
 *   method="updateStatus" → 会計状況更新（customerId/hash/billStatus）
 *
 * すべてのフィールドはnull許容（methodによって使うものが異なる）。
 */
public class PosOrderRequest {

    private String method;
    private String customerId;
    private Integer billStatus;
    private String fromTime;
    private String toTime;
    private String hash;

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public Integer getBillStatus() { return billStatus; }
    public void setBillStatus(Integer billStatus) { this.billStatus = billStatus; }

    public String getFromTime() { return fromTime; }
    public void setFromTime(String fromTime) { this.fromTime = fromTime; }

    public String getToTime() { return toTime; }
    public void setToTime(String toTime) { this.toTime = toTime; }

    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }
}
