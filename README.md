# Book-Database
The objective of this project is to get an experience in developing a network application based on the client/server architecture.By building a web application that is used as a simple book database. The website allows the users to lookup books abstracts, genres, authors, reviews… etc. Users should be allowed to create an account, add books to their “want to read” lists and search for books.

# Technologies #
* Node.js
* Express
* File System 
  * It's a core module in NodeJS. It is an API that allows you to interact with the file system in your computer. Used to create a local database for the website as a simple storage files for your data.
 
 # Deployment #
 * Heroku
   * Website Link : https://obscure-river-68470.herokuapp.com/
  
  # Components #
* Users Login (Main Page):
  * Registered users are allowed to log in to their accounts using their stored username and password. If an unregistered user tries to log in an error message is displayed.
* User Registration:
  * Users are allowed to create an account using a unique username and a password and the users’ information are stored in a JSON file that represents a simple database. If the user tried to register using an already taken username, an error message is displayed.
* Home Page:
  * The home page is the first page that is encountered by the users when they log in to their accounts. It contains several book genres and a button to view the user’s “want to read” list. When the user clicks on any book genre, they are redirected to that genre’s page.
* Genre Page:
  * The genre page contains all the books within this genre. When a user clicks on any book’s name, they are redirected to that book’s page.
* Book Page:
  * The book page contains an abstract for the book. The page contains an embedded video describing the book which can be streamed by the user. Finally, an “add to want to read” button. The button adds this book to the user’s “want to read” list in the database.
* Want to Read List Page:
  * The want to read list page contains the books that the user previously added using the “add to want to read list” button. A “view want to read list” button should be added to the home page that directs the user to their own want to read list page.
* Search:
  * A search bar is displayed in all pages except for the registration and login pages. The search will be done using books names only. The search result is either a “book not found” message if the book was not available in the database or a list of the books that contain the search keyword in their names. The search results are clickable and they direct the user to that specific book’s page.
