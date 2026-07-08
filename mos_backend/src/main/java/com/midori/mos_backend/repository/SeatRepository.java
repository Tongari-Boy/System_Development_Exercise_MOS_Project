package com.midori.mos_backend.repository;

import com.midori.mos_backend.Entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 卓を管理するリポジトリインターフェース
 */
@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    Optional<Seat> findBySeatNumber(String seatNumber);

    Optional<Seat> findByQrCode(String qrCode);

    List<Seat> findByStatus(Seat.Status status);

    List<Seat> findByFloorOrderBySeatNumberAsc(int floor);

    /**
     * QRコード読み取り時のセッション開始・人数加算を単一のUPDATE文で原子的に行う
     * 読み取り→書き込みの2段階にすると、同時アクセス時にDBの競合エラー
     * （Record has changed since last read）を起こすため、これを避ける
     *
     * @return 更新できた件数（0件ならQRコードが存在しないか期限切れ）
     */
    @Modifying
    @Query("UPDATE Seat s SET s.customerCount = s.customerCount + 1, " +
            "s.sessionStartedAt = COALESCE(s.sessionStartedAt, :now), " +
            "s.updatedAt = :now " +
            "WHERE s.qrCode = :qrCode AND s.qrExpiresAt > :now")
    int recordQrScan(@Param("qrCode") String qrCode, @Param("now") LocalDateTime now);
}
