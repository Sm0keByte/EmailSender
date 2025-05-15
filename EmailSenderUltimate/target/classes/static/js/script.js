document.addEventListener("DOMContentLoaded", () => {
  // 1. Controlla se ci sono dati di prefill salvati (dal successo della registrazione)
  const prefillEmail = localStorage.getItem("prefillEmail");
  const prefillPassword = localStorage.getItem("prefillPassword");
  if (prefillEmail && prefillPassword) {
    const loginEmailElem = document.getElementById("login-email");
    const loginPasswordElem = document.getElementById("login-password");
    if (loginEmailElem) loginEmailElem.value = prefillEmail;
    if (loginPasswordElem) loginPasswordElem.value = prefillPassword;
    // Rimuovi i dati di prefill dal localStorage per non mantenerli indefinitamente
    localStorage.removeItem("prefillEmail");
    localStorage.removeItem("prefillPassword");

    // Assicurati che la UI torni allo stato iniziale (pannello di Sign In visibile)
    const container = document.getElementById("container");
    if (container) {
      container.classList.remove("right-panel-active");
    }
  }

  // 2. Gestione del toggle tra pannelli (Sign In / Sign Up)
  const container = document.getElementById("container");
  const toggleButtons = document.querySelectorAll(".ghost");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Evita che il click dei toggle faccia un submit se per caso fosse in un form
      event.preventDefault();
      if (container) {
        container.classList.toggle("right-panel-active");
      }
    });
  });

  // 3. Gestione del form di registrazione (Sign Up)
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Impedisce il comportamento di submit che ricarica la pagina in modo anomalo

      // Estrai e "pulisci" i valori dei campi
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !email || !password) {
        alert("Tutti i campi sono obbligatori. Controlla i dati inseriti.");
        return;
      }

      const registrationData = { username, email, password };

      // Invia la richiesta AJAX all'endpoint per la registrazione
      fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData)
      })
          .then(response => response.json())
          .then(result => {
            if (result.status && result.status === "success") {
              // Se la registrazione ha successo:
              // - Salva email e password nel localStorage (per il prefill del form di login)
              localStorage.setItem("prefillEmail", email);
              localStorage.setItem("prefillPassword", password);
              alert("Registrazione avvenuta con successo.");
              // Ricarica la pagina per far tornare l'interfaccia allo stato iniziale (Sign In)
              location.reload();
            } else {
              alert(result.message || "Errore nella registrazione.");
            }
          })
          .catch(error => {
            console.error("Errore nella registrazione:", error);
            alert("Si è verificato un errore nella registrazione: " + error.message);
          });
    });
  }

  // 4. Gestione del form di login (Sign In)
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Impedisce il submit standard

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      if (!email || !password) {
        alert("Inserisci email e password per il login.");
        return;
      }
      const loginData = { email, password };

      // Invia la richiesta AJAX all'endpoint per il login
      fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      })
          .then(response => response.json())
          .then(result => {
            if (result.status && result.status === "success") {
              // Se il login è riuscito, reindirizza alla pagina /email
              window.location.href = "/email";
            } else {
              alert(result.message || "Credenziali non valide.");
            }
          })
          .catch(error => {
            console.error("Errore nel login:", error);
            alert("Si è verificato un errore nel login: " + error.message);
          });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const logjnForm = document.getElementById("login-form");

  if(loginForm) {
    loginForm.addEventListener("submit", function (event){
      event.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      if (!email || !password) {
        alert("Inserisci email e password per il login.");
        return;
      }
      const loginData = { email, password };

      fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      })
          .then(response => {
            if(!response.ok) {
              throw new Error("Errore nella risposta: " + response.status);
            }
            return response.json();
          })
          .then(result => {
            console.log("Risposta login: ", result);
            if(result.status && result.status === "success"){
              window.location.href = "/email";
            }else{
              alert(result.message || "Credenziali non valide.");
            }
          })
          .catch(error => {
            console.error("Errore nel login:", error);
            alert("Si è verificato un errore nel login: " + error.message);
          });
    });
  }
});
