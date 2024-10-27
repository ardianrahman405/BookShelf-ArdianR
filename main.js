document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('bookForm');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const searchBook = document.getElementById('searchBook');

    let books = JSON.parse(localStorage.getItem('books')) || [];

    function saveBooksToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = Number(document.getElementById('bookFormYear').value);
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        const book = {
            id: Date.now(),
            title,
            author,
            year,
            isComplete
        };

        books.push(book);
        saveBooksToLocalStorage();
        updateBookshelf();
        bookForm.reset();
    });

    function updateBookshelf() {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        books.forEach(book => {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
    }

    function createBookItem(book) {
        const bookItem = document.createElement('div');
        bookItem.setAttribute('data-bookid', book.id);
        bookItem.setAttribute('data-testid', 'bookItem');

        const title = document.createElement('h3');
        title.setAttribute('data-testid', 'bookItemTitle');
        title.textContent = book.title;

        const author = document.createElement('p');
        author.setAttribute('data-testid', 'bookItemAuthor');
        author.textContent = `Penulis: ${book.author}`;

        const year = document.createElement('p');
        year.setAttribute('data-testid', 'bookItemYear');
        year.textContent = `Tahun: ${book.year}`;

        const actionButtons = document.createElement('div');

        const toggleButton = document.createElement('button');
        toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
        toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        toggleButton.addEventListener('click', () => {
            book.isComplete = !book.isComplete;
            saveBooksToLocalStorage();
            updateBookshelf();
        });

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        deleteButton.textContent = 'Hapus Buku';
        deleteButton.addEventListener('click', () => {
            books = books.filter(b => b.id !== book.id);
            saveBooksToLocalStorage();
            updateBookshelf();
        });

        actionButtons.appendChild(toggleButton);
        actionButtons.appendChild(deleteButton);
        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(actionButtons);

        return bookItem;
    }

    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = document.getElementById('searchBookTitle').value.toLowerCase();

        const searchResults = books.filter(book => {
            return (
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.year.toString().includes(query)
            );
        });

        updateSearchResults(searchResults);
    });

    function updateSearchResults(results) {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        results.forEach(book => {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
    }

    updateBookshelf(); // Memperbarui rak buku saat halaman dimuat
});
