package com.dao.adminservice.repository;

import com.dao.adminservice.entity.CrackDemoHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrackDemoHistoryRepository extends JpaRepository<CrackDemoHistory, Long> {
}
