package vn.edu.iuh.fit.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.models.Genre;
import vn.edu.iuh.fit.repositories.GenreRepository;
import vn.edu.iuh.fit.services.GenreServices;

import java.util.List;
import java.util.Optional;

@Service
public class GenreServiceImpl implements GenreServices {

    @Autowired
    private GenreRepository genreRepository;

    @Override
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @Override
    public Optional<Genre> getGenreById(int id) {
        return genreRepository.findById(id);
    }

}