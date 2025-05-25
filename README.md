# EmptyCup Internship Assignment

This repository contains the EmptyCup internship task: a mobile web page listing interior designers with shortlisting functionality, styled per the provided Figma design. The project uses a **Flask + MongoDB Atlas** backend, is containerized with **Docker**, and is deployed publicly on **Netlify (frontend)** and **Render (backend)**.

---

## 🔗 Live Deployments

- **Frontend (Netlify)**: [https://cup-empty.netlify.app](https://cup-empty.netlify.app/)  
  _Replace with your actual Netlify URL_

- **Backend API (Render)**: [https://empty-cup-7c9e.onrender.com](https://empty-cup-7c9e.onrender.com)  
  _Replace with your actual Render URL_

---

## 📦 Project Overview

### ✅ Frontend
- Built with **HTML**, **CSS**, and **JavaScript**
- Matches the provided **Figma** design
- Features:
  - Toggleable shortlist button (outline ↔ filled icon)
  - “Shortlisted” filter to view selected designers
- Fonts and icons sourced from Figma

### ✅ Backend
- **Flask-based REST API**
- Serves designer listings as JSON from MongoDB Atlas

### ✅ Database
- **MongoDB Atlas** used to store designer listings

### ✅ Containerization
- **Docker** and **Docker Compose** orchestrate:
  - Frontend
  - Backend
  - Local MongoDB instance (for offline development)

---

## 📁 Project Structure

empty-cup/
├── server/
│ ├── app.py # Flask REST API for listings
│ ├── requirements.txt # Python dependencies
│ ├── Dockerfile # Backend container configuration
├── client/
│ ├── index.html # Mobile web page
│ ├── css/ # Styling files
│ ├── js/script.js # Shortlisting functionality
│ ├── Dockerfile # Frontend container configuration
├── docker-compose.yml # Orchestrates services
├── README.md # This file


---

## 🛠️ Prerequisites

- Git  
- Docker  
- Docker Compose  
- MongoDB Atlas account (or use local MongoDB for testing)

---

## 🚀 Local Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/empty-cup.git
cd empty-cup
