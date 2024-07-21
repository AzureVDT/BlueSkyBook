package vn.edu.iuh.fit.services;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.models.Book;
import vn.edu.iuh.fit.models.Genre;

import java.util.List;
import java.util.Optional;

public interface BookServices {
    List<Book> getAllBooks();
    Optional<Book> getBookById(int id);
    List<Book> getBooksByGenre(Genre genre);
    Book addBook(Book book);
    Book updateBookQuantity(int id, int availableQuantity);
    void deleteBook(int id);
}