// Import Firebase modules using modular syntax
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC44YhIMQBzeynidFdsrMYHTP9xQvVnnoo",
  authDomain: "marsias-32f6a.firebaseapp.com",
  databaseURL: "https://marsias-32f6a-default-rtdb.firebaseio.com",
  projectId: "marsias-32f6a",
  storageBucket: "marsias-32f6a.firebasestorage.app",
  messagingSenderId: "318751973530",
  appId: "1:318751973530:web:04a178841cde22bee63f23",
  measurementId: "G-503C3S1QEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, "messages");

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  
  try {
    // Get form values
    const fullName = getElementVal("name");
    const email = getElementVal("email");
    const phone = getElementVal("phone");
    const message = getElementVal("message");
    
    // Log values for debugging
    console.log("Submitting values:", { fullName, email, phone, message });
    
    // Save message to Firebase
    saveMessage(fullName, email, phone, message);
    
    // Create and show alert message
    const alertContainer = document.createElement("div");
    alertContainer.className = "alert";
    alertContainer.style.display = "block";
    alertContainer.style.padding = "10px";
    alertContainer.style.backgroundColor = "#4CAF50";
    alertContainer.style.color = "white";
    alertContainer.style.borderRadius = "5px";
    alertContainer.style.marginTop = "20px";
    alertContainer.textContent = "Mesajınız başarıyla gönderildi!";
    
    // Add alert before form
    const formElement = document.getElementById("contact-form");
    formElement.parentNode.insertBefore(alertContainer, formElement);
    
    // Remove the alert after 3 seconds
    setTimeout(() => {
      alertContainer.style.display = "none";
    }, 3000);
    
    // Reset the form
    document.getElementById("contact-form").reset();
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Mesaj gönderilirken bir hata oluştu: " + error.message);
  }
}

const saveMessage = (fullName, email, phone, message) => {
  try {
    // Push a new message to the database
    push(messagesRef, {
      fullName: fullName,
      email: email,
      phone: phone,
      message: message,
      timestamp: serverTimestamp()
    });
    console.log("Message saved successfully!");
  } catch (error) {
    console.error("Error saving message:", error);
    throw error; // Re-throw to handle in the caller
  }
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};