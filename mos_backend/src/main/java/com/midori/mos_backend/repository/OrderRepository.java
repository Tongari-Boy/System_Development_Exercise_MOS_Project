package com.midori.mos_backend.repository;

import com.midori.mos_backend.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 注文を管理するリポジトリインターフェース
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findBySeatId(Long seatId);

    List<Order> findByStatus(Order.Status status);

    List<Order> findByStatusIn(List<Order.Status> statuses);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startOfDay AND o.createdAt < :endOfDay ORDER BY o.createdAt DESC")
    List<Order> findTodayOrders(LocalDateTime startOfDay, LocalDateTime endOfDay);

    boolean existsByCustomerId(String customerId);

    Optional<Order> findByCustomerId(String customerId);

    /**
     * レジ（POS）向け注文検索
     * customerId/fromTime/toTime はnull許容（未指定の場合は絞り込まない）
     * キャンセル済み注文と客番号未発行の注文はレジから見えないよう除外する
     */
    @Query("SELECT o FROM Order o WHERE o.customerId IS NOT NULL " +
            "AND o.status <> :cancelledStatus " +
            "AND (:customerId IS NULL OR o.customerId = :customerId) " +
            "AND (:fromTime IS NULL OR o.orderedAt >= :fromTime) " +
            "AND (:toTime IS NULL OR o.orderedAt <= :toTime) " +
            "ORDER BY o.orderedAt DESC")
    List<Order> findForPos(String customerId, LocalDateTime fromTime, LocalDateTime toTime, Order.Status cancelledStatus);
}
