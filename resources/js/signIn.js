const clerkPubKey =
  "pk_test_c2V0dGxlZC1taW5ub3ctNjAuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Replace with your actual Clerk Publishable Key

(async () => {
  // Dynamically load Clerk library
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@4/dist/clerk.browser.js";
  script.type = "text/javascript";
  script.async = true;

  script.onload = script.onreadystatechange = function () {
    if (
      !this.readyState ||
      this.readyState === "loaded" ||
      this.readyState === "complete"
    ) {
      script.onload = script.onreadystatechange = null;

      // Initialize Clerk library after script is loaded
      const clerk = new window.Clerk(clerkPubKey);

      clerk
        .load()
        .then(() => {
          const userButtonDiv = document.getElementById("user-button");
          clerk.mountUserButton(userButtonDiv);
        })
        .catch((error) => {
          console.error("Failed to load Clerk:", error);
        });
    }
  };

  script.onerror = () => {
    console.error("Failed to load Clerk library");
  };

  // Append the script to the document body to start loading
  document.body.appendChild(script);
})();
