package vn.edu.iuh.fit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.fit.models.Genre;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
}