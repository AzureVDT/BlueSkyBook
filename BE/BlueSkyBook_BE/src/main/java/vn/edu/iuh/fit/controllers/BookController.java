package vn.edu.iuh.fit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.dto.UpdateQuantityRequest;
import vn.edu.iuh.fit.models.Book;
import vn.edu.iuh.fit.models.Genre;
import vn.edu.iuh.fit.services.BookServices;
import vn.edu.iuh.fit.services.GenreServices;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/book")
public class BookController {

    @Autowired
    private BookServices bookService;

    @Autowired
    private GenreServices genreService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable int id) {
        Optional<Book> book = bookService.getBookById(id);
        if (book.isPresent()) {
            return ResponseEntity.ok(book.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/genre/{genreId}")
    public ResponseEntity<List<Book>> getBooksByGenre(@PathVariable int genreId) {
        Optional<Genre> genre = genreService.getGenreById(genreId);
        if (genre.isPresent()) {
            List<Book> books = bookService.getBooksByGenre(genre.get());
            return ResponseEntity.ok(books);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Book> updateBookQuantity(@PathVariable int id, @RequestBody UpdateQuantityRequest request) {
        try {
            Book updatedBook = bookService.updateBookQuantity(id, request.getAvailableQuantity());
            return ResponseEntity.ok(updatedBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteBook(@PathVariable int id) {
        if (bookService.getBookById(id).isPresent()) {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
