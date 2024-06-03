import Clerk from "@clerk/clerk-js";

const clerkPubKey =
  "pk_test_c2V0dGxlZC1taW5ub3ctNjAuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Replace with your actual Clerk Publishable Key

const clerk = new Clerk(clerkPubKey);

(async () => {
  await clerk.load();

  if (clerk.user) {
    const userButtonDiv = document.getElementById("user-button");
    clerk.mountUserButton(userButtonDiv);
  } else {
    // Redirect to userSignIn.html if not signed in
    window.location.href = "userSignIn.html";
  }
})();
