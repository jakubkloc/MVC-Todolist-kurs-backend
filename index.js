// prosty serwer w expressie który słuzy do zachowywania dodanych zadań w aplikacji TODOLIST zamiast wykorzystywania local storage.

// w projekcie jest zainstalowany pakiet nodemon który automatycznie restartuje serwer po wykryciu zmian w plikach serwera za pomocą komedny "nodemon index.js"
// w package.json jest przygotowana komenda start aby odpalić serwer przy pomocy nodemon

// zaimportowanie modułu 
const express = require("express")
// zaimportowanie paczki cors (w celu umożliwienia obsługi zapytań)
const cors = require("cors");
// utworzenie aplikacji
const app = express();

// użycie corsa aby umożliwić obsługę zapytań
app.use(cors());

// kod niezbędny aby aplikacja w expressie po otrzymaniu danych w formacie JSON parsowała je na takie które może następnie prztworzyć w swoich funkcjach middleware (ponieważ domyślnie express nie obsługuje formatu JSON)
app.use(express.json());

// utworzenie zmiennej do przechowywania stanu apliakcji (zapisanych zadań i ich wykonaniu)
const todoList = [];

// poinformanie aplikacji aby oczekiwała zapytań GET na url '/'
app.get('/', (req, res) => {
  // wysłanie odpowiedzi do klienta, automatycznie ustawia typ zawartości w nagłówku na podtsawie wprowadzonego argumentu (w tym przypadku string)
  res.send("Serwer działa!");
  // res.send() zazwyczaj kończy obsługę zapytania
})
  // req - obiekt reprezentujący zapytanie (request)
  // res - obiekt reprezentujący odpowiedź (response)

// jak aplikacjam a reagować na zapytania POST na adresie '/todos'  
app.post("/todos", (req,res) => {
  // wypisz w konsoli obiekt zapytania
  console.log(req.body);
  // dodanie wysłanego zadania do naszej zmiennej przetrzymującej stan aplikacji (ponieważ wiemy, że funkcja fetch na frotnendzie z metodą post jest tak skonfigurowana aby w body przesyłać obiekt opisujący zadanie z todolisty)
  todoList.push(req.body)
  // ustaw kod odpowiedzi na 200 (pomyślny) i zakończ obsługe zapytania 
  res.status(200).end();
})

// przetwarzanie zapytań GET na endpoincie "/todos" (pytanie o stan aplikacji)
app.get("/todos", (req, res) => {
  // zwracanie zapisanej w pamieci todoListy 
  res.json({ todoList });
});

// przetwarzanie zapytań DELETE na endpoincie  '/todos/:todoId'
// zwróć uwagę, że utworzyliśmy sparametryzowany endopint :todoId za każdym razem będzie inne
app.delete("/todos/:todoId", (req, res) => {
  // teraz korzystając z req.params.todoId wyciągamy wartość tego parametru która jest domyślnie w stringu więc korzystamy z parseInt i podajemy 10 jako że chcemy aby liczba ta była w systemie dziesiętnym i przypisujemy ją do todoId
  const todoId = parseInt(req.params.todoId, 10);
  
  // znajdujemy indeks zadania które chcemy usunąć porównując id z id zadań z listy
  const todoItemIndex = todoList.findIndex((e) => e.id === todoId);

  // jeśli index zostanie znaleziony...
  if (todoItemIndex !== undefined) {
    // ... to usuń zadanie o takim indeksie z listy 
    todoList.splice(todoItemIndex, 1);
    res.status(200).end();
  } else {
    // w przeciwnym wypadku zgłoś błąd
    res.status(404).end();
  }
});

// przetwarzanie zapytań typu PATCH analogicznie z zmiennym parametrem w url :todoId
app.patch("/todos/:todoId", (req, res) => {
  // analogicznie zapisanie id do zmiennej todoId
  const todoId = parseInt(req.params.todoId, 10);
  // znalezienie elementu do aktualizacji na liście todoList i zapisanie go w todoItem
  const todoItem = todoList.find((e) => e.id === todoId);

  // teraz są 3 warunki:
    // aktualizacja completed
    // aktualizacja title
    // aktualizacja completed oraz title
  // można to zrealizować przez ciąg if 

  // sprawdzenie czy jakiekolwiek zadanie do aktualizacji istnieje i nie popełniono błędu
  if (todoItem) {
  const update = req.body;
  
    // aktualizacja kompletności zadania (jeśli była)
    if (update.completed !== undefined) {
    todoItem.completed = update.completed;
    } 

    // aktualizacja tytułu zadania (jeśli była)
    if (update.title !== undefined) {
    todoItem.title = update.title;
    }
  
  // zakończenie obsługi zapytania i zwrócenie kodu sukces  
  res.status(200).end();
    
  } else {
  // zakończenie obsługi zapytania i zwrócenie kodu błedu
  res.status(404).end();
  }
});

// utworzenie zmiennnej port w której będzie zapisany port na jakim działą aplikacja
const port = process.env.PORT || 8888;

//wskazanie portu i funkcji callback 
app.listen(port, ()=> {console.log(`Aplikacja wystartowała na porcie ${port}`);
});

