// Global Variables
var bookmarks = [];
var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var submitBtn = document.getElementById("submitBtn");
var urlFeedback = document.getElementById("urlFeedback");
var urlValidFeedback = document.getElementById("urlValidFeedback");
var nameFeedback = document.getElementById("nameFeedback");
var tableBody = document.getElementById("bookmarkTable");

// Load bookmarks from localStorage
var storedBookmarks = localStorage.getItem("bookmarks");
if (storedBookmarks) {
  bookmarks = JSON.parse(storedBookmarks);
  DisplayBookmarks();
}


function isValidUrl(url) {
  var urlPattern =
    /^(https?:\/\/)?[\w-]+(\.[\w-]+)*\.(com|net)(\/)?$/i;
  return urlPattern.test(url);
}

// Real-time URL validation
function validateUrl() {
  var siteUrlValue = siteUrl.value.trim();
  if (siteUrlValue === "") {
    siteUrl.classList.remove("is-valid", "is-invalid");
    urlFeedback.textContent = "Site URL is required.";
    urlValidFeedback.style.display = "none";
  } else if (isValidUrl(siteUrlValue)) {
    siteUrl.classList.remove("is-invalid");
    siteUrl.classList.add("is-valid");
    urlFeedback.textContent = "";
    urlValidFeedback.style.display = "block";
  } else {
    siteUrl.classList.remove("is-valid");
    siteUrl.classList.add("is-invalid");
    urlFeedback.textContent = "Invalid URL";
    urlValidFeedback.style.display = "none";
  }
  validateForm();
}

// Validate the entire form to enable/disable submit button
function validateForm() {
  var siteNameValue = siteName.value.trim();
  var siteUrlValue = siteUrl.value.trim();

  // Validate Site Name
  if (siteNameValue === "") {
    siteName.classList.remove("is-valid");
    siteName.classList.add("is-invalid");
    nameFeedback.style.display = "block";
  } else {
    siteName.classList.remove("is-invalid");
    siteName.classList.add("is-valid");
    nameFeedback.style.display = "none";
  }

  // Enable/disable submit button
  if (siteNameValue && siteUrlValue && isValidUrl(siteUrlValue)) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// Function to add a bookmark
function addBookmark() {
  var siteNameValue = siteName.value.trim();
  var siteUrlValue = siteUrl.value.trim();
  var formattedUrl =
    siteUrlValue.startsWith("http://") || siteUrlValue.startsWith("https://")
      ? siteUrlValue
      : "https://" + siteUrlValue;

  var bookmark = {
    name: siteNameValue,
    url: formattedUrl,
  };

  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  DisplayBookmarks();
  ClearForm();
}

// Clear the form
function ClearForm(){
  siteName.value = "";
  siteUrl.value = "";
  siteName.classList.remove("is-valid", "is-invalid");
  siteUrl.classList.remove("is-valid", "is-invalid");
  nameFeedback.style.display = "none";
  urlFeedback.textContent = "Site URL is required.";
  urlValidFeedback.style.display = "none";
  submitBtn.disabled = true;
}

// Function to display bookmarks in the table
function DisplayBookmarks() {
  var row = ``;
  for (var i = 0; i < bookmarks.length; i++) {
    row += `
      <tr>
      <td>${i + 1}</td>
      <td>${bookmarks[i].name}</td>
      <td><button class="visit-btn" onclick="visitBookmark('${
        bookmarks[i].url
      }')"><i class="fas fa-eye me-1"></i>Visit</button></td>
      <td><button class="delete-btn" data-index="${i}"><i class="fas fa-trash-alt me-1"></i>Delete</button></td>
      </tr>
    `;
  }
  tableBody.innerHTML = row;
}

// Function to handle table clicks for visit and delete
function handleTableClick(event) {
  var target = event.target;
  if (target.classList.contains("visit-btn")) {
    var url = target.getAttribute("onclick").match(/'([^']+)'/)[1];
    visitBookmark(url);
  } else if (target.classList.contains("delete-btn")) {
    var index = target.getAttribute("data-index");
    deleteBookmark(index);
  }
}

// Function to visit a bookmark
function visitBookmark(url) {
  window.open(url, "_blank");
}

// Function to delete a bookmark
function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  DisplayBookmarks();
}
