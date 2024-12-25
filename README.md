API for Books using MongoDB as DB

running the server 
1: Npm install
2: node index.js

-- creating new book ->
in postman - 
put localhost:8080/books  or since im using codespaces then - https://solid-lamp-4wpx77jvjq7cj6j5-8080.app.github.dev/books in URL
set the method to post
in header- content type - application/json
in body- raw- json -
 {
    "title": "Title6",
    "author": "Author6",
    "year": 1000,
    "price": 10
}

-- getting all books - 
localhost:8080/books  
or 
https://solid-lamp-4wpx77jvjq7cj6j5-8080.app.github.dev/books 

