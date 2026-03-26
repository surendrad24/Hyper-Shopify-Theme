// document.addEventListener("DOMContentLoaded", function () {
//   const wishlistButtons = document.querySelectorAll(".wt-button");
//   const wishlistCountEl = document.getElementById("wt-count");
  
//   // Try to find the data under ANY common name to avoid 'undefined'
//   let wishlist = JSON.parse(localStorage.getItem("wishlist")) || 
//                  JSON.parse(localStorage.getItem("shopify_wishlist")) || [];

//   // Immediately save it back to 'wishlist' to unify the naming
//   localStorage.setItem("wishlist", JSON.stringify(wishlist));

//   // Initialize wishlist button state
//   wishlistButtons.forEach(button => {
//     const handle = button.dataset.productHandle;
//     if (wishlist.includes(handle)) {
//       button.classList.add("active");
//     }
    

//     button.addEventListener("click", function () {
//       const handle = this.dataset.productHandle;

//       if (!wishlist.includes(handle)) {
//         wishlist.push(handle);
//         showSuccessNotification("Added to Wishlist.");
//       } else {
//         wishlist = wishlist.filter(h => h !== handle);
//         showSuccessNotification("Removed from Wishlist.");
//       }

//       localStorage.setItem("wishlist", JSON.stringify(wishlist));
//       this.classList.toggle("active");
//       updateWishlistCount();
//     });
//   });

//   function updateWishlistCount() {
//     if (wishlist.length > 0) {
//       wishlistCountEl.textContent = wishlist.length;
//       wishlistCountEl.style.display = "flex";
//     } else {
//       wishlistCountEl.textContent = "";
//       wishlistCountEl.style.display = "none";
//     }
//   }

//   function showSuccessNotification(message) {
//     const existing = document.getElementById("success-notification");
//     if (existing) existing.remove();

//     const notification = document.createElement("div");
//     notification.id = "success-notification";
//     notification.className = "success-notification";
//     notification.innerHTML = `
//       <div class="success-msg">
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="icon icon-checkmark" viewBox="0 0 12 9">
//           <path fill="currentColor" fill-rule="evenodd" d="M11.35.643a.5.5 0 0 1 .006.707l-6.77 6.886a.5.5 0 0 1-.719-.006L.638 4.845a.5.5 0 1 1 .724-.69l2.872 3.011 6.41-6.517a.5.5 0 0 1 .707-.006z" clip-rule="evenodd"/>
//         </svg>
//         <span>${message}</span>
//       </div>
//     `;

//     document.body.appendChild(notification);

//     setTimeout(() => {
//       notification.style.opacity = '0';
//       setTimeout(() => notification.remove(), 1000);
//     }, 2000);
//   }
// // THE BRIDGE: This fixes the "addToWishlist is not defined" error
//   window.addToWishlist = function(handle) {
//     if (!handle) return;
    
//     let currentList = JSON.parse(localStorage.getItem("wishlist")) || [];
//     currentList = currentList.filter(h => h && h.trim() !== ""); // Clean data

//     if (!currentList.includes(handle)) {
//       currentList.push(handle);
//       localStorage.setItem("wishlist", JSON.stringify(currentList));
      
//       // Update the page without refreshing
//       window.dispatchEvent(new Event('wishlistUpdated'));
      
//       // Show your notification if the function exists
//       if (typeof showSuccessNotification === "function") {
//         showSuccessNotification("Added to Wishlist.");
//       }
//     } else {
//       // Logic for removing if clicked again
//       currentList = currentList.filter(h => h !== handle);
//       localStorage.setItem("wishlist", JSON.stringify(currentList));
//       window.dispatchEvent(new Event('wishlistUpdated'));
//     }
//   };
 
// });

document.addEventListener("DOMContentLoaded", function () {
  const wishlistButtons = document.querySelectorAll(".wt-button");
  const wishlistCountEl = document.getElementById("wt-count");
  
  // 1. Load and CLEAN the list (removes empty ghost items)
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || 
                 JSON.parse(localStorage.getItem("shopify_wishlist")) || [];
  wishlist = wishlist.filter(h => h && h.trim() !== ""); 

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // 2. Function to update count (and hide if 0)
  function updateWishlistCount() {
    if (!wishlistCountEl) return;
    
    const count = wishlist.length;
    if (count > 0) {
      wishlistCountEl.textContent = count;
      wishlistCountEl.style.display = "flex"; // Show bubble
    } else {
      wishlistCountEl.style.display = "none"; // Hide bubble if 0
    }
  }

  // 3. Initialize heart buttons on page load
  wishlistButtons.forEach(button => {
    const handle = button.dataset.productHandle;
    if (wishlist.includes(handle)) {
      button.classList.add("active");
    }

    button.addEventListener("click", function () {
      const handle = this.dataset.productHandle;
      if (!wishlist.includes(handle)) {
        wishlist.push(handle);
        showSuccessNotification("Added to Wishlist.");
      } else {
        wishlist = wishlist.filter(h => h !== handle);
        showSuccessNotification("Removed from Wishlist.");
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      this.classList.toggle("active");
      updateWishlistCount(); // Update count on click
    });
  });

  // 4. Global Event Listener (for sync with Wishlist Page)
  window.addEventListener('wishlistUpdated', function() {
    wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(h => h && h.trim() !== "");
    updateWishlistCount();
  });

  // --- Notification Function ---
  function showSuccessNotification(message) {
    const existing = document.getElementById("success-notification");
    if (existing) existing.remove();
    const notification = document.createElement("div");
    // notification.id = "success-notification";
    // notification.className = "success-notification";
    // notification.innerHTML = `<div class="success-msg"><span>${message}</span></div>`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '0'; setTimeout(() => notification.remove(), 1000); }, 2000);
  }

  window.addToWishlist = function(handle) {
    if (!handle) return;
    if (!wishlist.includes(handle)) {
      wishlist.push(handle);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistCount();
      // showSuccessNotification("Added to Wishlist.");
    }
  };

  // IMPORTANT: RUN THESE ONCE ON PAGE LOAD
  updateWishlistCount(); 
});

