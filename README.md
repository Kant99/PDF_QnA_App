# PDF Q&A App

A web application built with the **MERN Stack** (MongoDB, Express, React, Node.js) and powered by **Ollama (Llama3)** for Generative AI. This app allows users to upload PDF documents and ask questions about their content. The app extracts text from PDFs and stores the data in **FAISS** (for vector storage) and **MongoDB** (for metadata storage), using **Llama3** to generate AI-powered answers to user queries in real time.

## Features

- **PDF Upload:** Users can upload PDF documents for analysis.
- **Natural Language Queries:** Users can ask questions based on the content of the uploaded PDFs.
- **Ollama (Llama3) AI-Powered Answers:** Llama3 processes the text from the PDFs to generate accurate, context-based answers.
- **FAISS Vector Storage:** PDF content is indexed into FAISS for efficient similarity search and fast retrieval of relevant data.
- **Real-Time Interaction:** Instant responses to user queries based on PDF content.
- **User-Friendly Interface:** Built with React for an intuitive, responsive user experience.

## Tech Stack

- **Frontend:**
  - **React.js**: JavaScript library for building the user interface.
  - **HTML5 & CSS3**: For structuring and styling the frontend.
  - **JavaScript**: The core scripting language for handling app logic.

- **Backend:**
  - **Node.js**: JavaScript runtime for the server-side logic.
  - **Express.js**: Framework for building the REST API that handles requests.

- **Database:**
  - **MongoDB**: NoSQL database to store user information and uploaded PDF metadata.
  - **FAISS**: A library for efficient similarity search and storage of vector data. PDF content is converted into vectors and stored in FAISS for fast retrieval during query processing.

- **AI Integration:**
  - **Ollama (Llama3)**: A generative AI model used to process the content of PDFs and generate context-based answers to user queries.

- **PDF Parsing:**
  - **pdf-lib** or **pdf.js**: Libraries used to extract text from the uploaded PDF files.

## Installation

### Prerequisites

- **Node.js** and **npm** (Node Package Manager) should be installed. You can download them from [here](https://nodejs.org/).
- **Ollama (Llama3)**: Install and set up **Ollama** on your machine by following their installation guide from [Ollama's website](https://ollama.com/).
- **FAISS**: You need to have **FAISS** installed on your machine for vector storage and similarity search. You can install FAISS by following the instructions on the [FAISS GitHub repository](https://github.com/facebookresearch/faiss).


