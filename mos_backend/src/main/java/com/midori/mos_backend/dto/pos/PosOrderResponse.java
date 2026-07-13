package com.midori.mos_backend.dto.pos;

import com.midori.mos_backend.Entity.Order;
import com.midori.mos_backend.Entity.OrderItem;
import com.midori.mos_backend.util.PosHashUtil;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * レジ（POS）向けの注文レスポンス
 *
 * POS側（regi）の OrderImportValidator / CustomerController が要求する
 * フィールド名・形式に厳密に合わせている。
 *   storeId    : 英大文字2桁の店舗ID
 *   entryTime  : ISO8601 (yyyy-MM-dd'T'HH:mm:ss)
 *   customerId : 7桁の客番号
 *   hash       : 8〜64桁の16進文字列（楽観ロック用）
 *   billStatus : 1〜15のビットマスク
 *   items      : 明細の配列
 */
public class PosOrderResponse {

    private static final DateTimeFormatter ISO = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    private final String storeId;
    private final String entryTime;
    private final String customerId;
    private final String hash;
    private final int billStatus;
    private final List<PosOrderItemResponse> items;

    private PosOrderResponse(String storeId, String entryTime, String customerId,
                             String hash, int billStatus, List<PosOrderItemResponse> items) {
        this.storeId = storeId;
        this.entryTime = entryTime;
        this.customerId = customerId;
        this.hash = hash;
        this.billStatus = billStatus;
        this.items = items;
    }

    /**
     * @param storeId 店舗ID（環境設定から渡す。例: "MH"）
     * @param taxRate 税率（%）。全商品一律で適用する
     */
    public static PosOrderResponse from(Order order, String storeId, int taxRate) {
        LocalDateTime entry = order.getOrderedAt() != null ? order.getOrderedAt() : order.getCreatedAt();

        List<PosOrderItemResponse> items = order.getItems().stream()
                .map(item -> PosOrderItemResponse.from(item, entry, taxRate))
                .collect(Collectors.toList());

        return new PosOrderResponse(
                storeId,
                entry != null ? entry.format(ISO) : null,
                order.getCustomerId(),
                PosHashUtil.computeHash(order),
                order.getBillStatus(),
                items
        );
    }

    public String getStoreId() { return storeId; }
    public String getEntryTime() { return entryTime; }
    public String getCustomerId() { return customerId; }
    public String getHash() { return hash; }
    public int getBillStatus() { return billStatus; }
    public List<PosOrderItemResponse> getItems() { return items; }

    /**
     * レジ（POS）向けの注文明細
     */
    public static class PosOrderItemResponse {

        private final String orderTime;
        private final String menuName;
        private final int unitPrice;
        private final int taxRate;
        private final int orderQty;
        private final int offerQty;
        private final String categoryName;

        private PosOrderItemResponse(String orderTime, String menuName, int unitPrice,
                                     int taxRate, int orderQty, int offerQty, String categoryName) {
            this.orderTime = orderTime;
            this.menuName = menuName;
            this.unitPrice = unitPrice;
            this.taxRate = taxRate;
            this.orderQty = orderQty;
            this.offerQty = offerQty;
            this.categoryName = categoryName;
        }

        public static PosOrderItemResponse from(OrderItem item, LocalDateTime orderTime, int taxRate) {
            String category = item.getMenuItem() != null && item.getMenuItem().getCategory() != null
                    ? item.getMenuItem().getCategory().getDisplayName()
                    : null;

            return new PosOrderItemResponse(
                    orderTime != null ? orderTime.format(ISO) : null,
                    item.getItemName(),
                    item.getUnitPrice(),
                    taxRate,
                    item.getQuantity(),
                    item.getQuantity(),
                    category
            );
        }

        public String getOrderTime() { return orderTime; }
        public String getMenuName() { return menuName; }
        public int getUnitPrice() { return unitPrice; }
        public int getTaxRate() { return taxRate; }
        public int getOrderQty() { return orderQty; }
        public int getOfferQty() { return offerQty; }
        public String getCategoryName() { return categoryName; }
    }
}
