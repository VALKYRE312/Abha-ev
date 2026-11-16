package com.abhaenterprise.employees.repository;

import com.abhaenterprise.employees.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Employee Repository
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    Optional<Employee> findByEmployeeNumber(String employeeNumber);

    Optional<Employee> findByUserId(UUID userId);

    List<Employee> findByIsActive(Boolean isActive);

    List<Employee> findByDepartment(String department);

    List<Employee> findByManagerId(UUID managerId);

    boolean existsByEmployeeNumber(String employeeNumber);
}
