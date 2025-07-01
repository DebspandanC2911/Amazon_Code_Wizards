# 🛡 Trusted Marketplace Solutions - Hackathon Prototype

This project is developed as a prototype submission for a Hackathon to improve user trust and transparency in e-commerce platforms like Amazon.

## 🚀 Overview

The goal of this project is to enhance buyer and seller experiences by increasing transparency and minimizing fraudulent behavior. We propose the following four core features:

---

## 🔧 Features

### 1. 🏷 *Seller-Based User Rating System*
A feature that rates customers based on:
- frequency of return
- Return behaviour

This empowers sellers with higher credibility to attract more buyers and *helps Amazon identify and promote trusted buyers*.

![image](https://github.com/user-attachments/assets/7fcdb0f4-2d26-4ddd-83ae-8bf367bca830)
![image](https://github.com/user-attachments/assets/7fb995ff-b775-4011-b4f8-ce73d7b77815)
![image](https://github.com/user-attachments/assets/3ab9d00d-506d-4873-ae64-acb24bcb8f4f)

[Demo](https://user-filter-phi.vercel.app/)

---

### 2. 🛑 *Fake Review Detection Model*
We use *Hugging Face Transformers* and custom logic to:
- *Block reviews* from users who haven't purchased the product
- Analyze and *label reviews* as Potential Spam using a pretrained NLP model
- Improve the authenticity of product feedback shown to customers

> 📌 Only verified buyers can submit reviews.

![image](https://github.com/user-attachments/assets/ed43d15c-d326-4b81-926e-15c332f54ab5)

---

### 3. 📦 *Open Box Delivery Option*
Added an option during checkout where customers can:
- Request *Open Box Delivery* to inspect the item before final acceptance
- Report discrepancies immediately if the product is not as described

This helps reduce *return frauds* and *boosts buyer confidence*.

![image](https://github.com/user-attachments/assets/dd39fdef-4115-4885-8c5d-d7b650e87529)
![image](https://github.com/user-attachments/assets/a0322601-6528-424f-973a-b199e73a3e40)
![image](https://github.com/user-attachments/assets/e053b168-81da-4cf9-8303-f9aa75ad255a)

[Demo](https://open-box-delivery.vercel.app/)

---

## 🛠 Tech Stack

- *Frontend*: React.js, Tailwind CSS
- *Backend*: Node.js, Express.js
- *Database*: MongoDB
- *ML/NLP*: Python, Google Gemini Pro Vision, Gemini APIs for Fake Review Detection
- *Other Tools*: Firebase (for prototype sync and Login), Git

---

## ✅ Future Improvements

- Real-Time Apparel Size Estimation 
- Shell Company Review Detection
- Dynamic Multi-Parameter Rating System

---

## 🧠 Team and Credits

Built with ❤ by *Code Wizards* for **Amazon HackOn Season 5 - 2025** .  



