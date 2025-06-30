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

---

### 2. 🛑 *Fake Review Detection Model*
We use *Hugging Face Transformers* and custom logic to:
- *Block reviews* from users who haven't purchased the product
- Analyze and *label reviews* as Potential Spam using a pretrained NLP model
- Improve the authenticity of product feedback shown to customers

> 📌 Only verified buyers can submit reviews.

---

### 3. 📦 *Open Box Delivery Option*
Added an option during checkout where customers can:
- Request *Open Box Delivery* to inspect the item before final acceptance
- Report discrepancies immediately if the product is not as described

This helps reduce *return frauds* and *boosts buyer confidence*.

---

### 4. 🖼 *Image-Based Anomaly Detection*
An ML-powered feature that:
- Allows customers to upload product images during Open Box delivery
- Compares uploaded images with catalog images using a CNN-based anomaly detection model

> Ensures visual integrity of the product at the point of delivery.

---

## 🛠 Tech Stack

- *Frontend*: React.js, Tailwind CSS
- *Backend*: Node.js, Express.js
- *Database*: MongoDB
- *ML/NLP*: Python, Hugging Face Transformers (BERT-based spam detection)
- *CV Model*: TensorFlow/Keras for image anomaly detection
- *Other Tools*: Firebase (for prototype sync), Git

---

## ✅ Future Improvements

- Improve image comparison accuracy using Vision Transformers (ViT).
- Automatically flags anomalies like *physical damage, missing parts, or wrong items*

---

## 🧠 Team and Credits

Built with ❤ by Code Wizards for Amazon HackOn Season 5 - 2025.  



