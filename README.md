# NC News Full-Stack Application

[Link - Backend Repo](https://github.com/PerryCole96/be-nc-news/blob/main/README.md)
[Link - Frontend Repo](https://github.com/PerryCole96/fe-nc-news/edit/main/README.md)

[Live Demo - Backend API](https://perry-be-nc-news.onrender.com/api)

## **Project Overview**

NC News is a full-stack web application featuring a **React.js** frontend and an **Express.js** backend powered by **PostgreSQL**. This project was developed as part of the **Northcoders** bootcamp to showcase skills in backend development, API design, and frontend development. The application allows users to view and interact with articles, comments, and topics, with features for voting and filtering.

---

## **Key Features**

### **Backend Features (API)**
- **Article Management**: Fetch, create, and filter articles by ID, author, or topic.
- **Commenting System**: Create, delete, and vote on comments associated with articles.
- **User Data**: Retrieve user profiles, including avatars and usernames.
- **Voting System**: Vote on articles and comments to influence their ranking.
- **Database Seeding**: Pre-populated with test data for development and testing.

### **Frontend Features**
- **Article Display**: View a list of articles with sorting options like date, vote count, and comment count.
- **Article Details**: View individual articles along with comments and voting options.
- **User Authentication**: Users can log in to see their profile and interact with content.
- **Voting**: Vote on articles and comments to update their vote counts in real-time.
- **Topic Filtering**: Filter articles by various topics like **Coding**, **Cooking**, and **Football**.

---

## **Technologies Used**

### **Backend**
- **Node.js**: JavaScript runtime for building the API.
- **Express**: Web framework used for building RESTful endpoints.
- **PostgreSQL**: Relational database for storing articles, comments, and user data.
- **Knex.js**: SQL query builder for interacting with the PostgreSQL database.
- **Supabase**: Cloud platform for hosting the database and backend.
- **Jest**: Testing framework for writing and running unit tests.
- **Model-View-Controller (MVC)**: Architecture used for API design.

### **Frontend**
- **React.js**: JavaScript library for building dynamic user interfaces with a component-based architecture.
- **React Router**: Library for handling client-side routing and page navigation.
- **React Context API**: Used for managing global state, such as user authentication data.
- **CSS**: Custom styling to create a responsive, user-friendly design.
- **Axios**: HTTP client for making API requests and fetching data.

---

## **Development Experience**

This project provided hands-on experience in the following areas:

- **Backend API Development**: Creating RESTful endpoints with Express and interacting with the database using Knex.js.
- **Database Design and Management**: Setting up and managing a PostgreSQL database, including migrations and seed data.
- **Frontend Development**: Building a React app with reusable components and integrating it with the backend API.
- **State Management**: Using React Context to manage global state, such as user authentication and article data.
- **Routing**: Implementing dynamic routing with React Router for smooth navigation.
- **Testing**: Following TDD principles for backend testing using Jest and ensuring frontend reliability with tests.
- **Deployment**: Deploying the backend API to Render and the frontend to a cloud platform.

---

## **Setup Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/PerryCole96/be-nc-news
   cd be-nc-news
   
2. Install dependencies
   ```bash
   npm install
   
3. Set up environment variables for development and testing:

   .env.development: PGDATABASE=nc_news
   .env.test: PGDATABASE=nc_news_test

4. Run the database migrations:
   ```bash
   npm run migrate

5. Seed the database with initial data:
   ```bash
   npm run seed

6. Start the server:
   ```bash
   npm start

The API will be available locally at http://localhost:9090/api.
