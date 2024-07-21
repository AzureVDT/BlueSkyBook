package vn.edu.iuh.fit.services;

import vn.edu.iuh.fit.models.Genre;

import java.util.List;
import java.util.Optional;

public interface GenreServices {
    List<Genre> getAllGenres();
    Optional<Genre> getGenreById(int id);
}