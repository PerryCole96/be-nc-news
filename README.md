# NC News API

[Live Demo]  
*https://perry-be-nc-news.onrender.com/api*

## **Project Overview**

NC News API is a backend service built using **Node.js** and **Express** that serves as the foundation for a fictional news website. The API allows users to interact with articles, topics, comments, and user data through RESTful endpoints. It includes features for managing articles, voting, retrieving user data, and more. The project was developed as part of the **Northcoders** bootcamp to demonstrate skills in backend development, database management, and API design.

---

## **Key Features**

### **Article Management**
- Allows users to fetch articles by ID, author, or topic.
- Provides the ability to vote on articles, helping to surface popular content.
- Supports sorting and filtering articles based on various fields such as title, votes, and comment count.

### **Commenting System**
- Users can create and delete comments for articles.
- Each comment can be voted on, providing users with the ability to interact with the content.

### **User Data**
- Retrieve a list of all users in the system.
- Each user has an avatar and a name, providing a simple user profile system.

### **Database Seeding**
- A script to seed the database with initial test data to support development and testing.

---

## **Technologies Used**

### **Backend**
- **Node.js**: JavaScript runtime for building the API.
- **Express**: Web framework used for building RESTful endpoints.
- **PostgreSQL**: Relational database for storing articles, comments, and user data.
- **Knex.js**: SQL query builder for interacting with the PostgreSQL database.
- **Supabase**: Cloud platform for hosting the database and backend.
- **Jest**: Testing framework for writing and running unit tests.

---

## **Development Experience**

This project provided valuable experience in the following areas:

- **Backend API development**: Implementing a RESTful API using Node.js and Express.
- **Database design**: Creating a relational database schema with PostgreSQL, including handling relationships between users, articles, and comments.
- **Database management**: Writing migration and seeding scripts to set up and populate the database.
- **Testing and validation**: Using Jest to write unit and integration tests to ensure the API functions as expected.
- **Deployment**: Deploying the API to the cloud using **Render** and **Supabase** for production database hosting.

---

## **API Endpoints**

The full list of API endpoints is available in JSON format, detailing all the available routes and their parameters. The endpoints support a variety of functionalities, including retrieving articles, managing comments, and voting on content. Please refer to the API documentation for the complete endpoint specification.

---

## **Setup Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/PerryCole96/be-nc-news
   cd be-nc-news

