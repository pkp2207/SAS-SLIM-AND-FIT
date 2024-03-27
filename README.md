Project Description:

Title: SAS Fit To Slim
Description: This project is a web application built using Node.js, Express.js, MongoDB, and Auth0 for user authentication. It includes features such as user registration, login, profile management, admin dashboard, and sending messages via WhatsApp using Twilio.

Routes Description :

GET / - Home Page:
This route checks if the user is authenticated using Auth0 (req.oidc.isAuthenticated()).
If the user is not authenticated, it renders the "once.ejs" view (presumably a login or landing page).
If the user is authenticated, it retrieves user data from MongoDB based on the user's email and renders the "homepage.ejs" view, passing the user data and profile photo.
GET /details - User Details Form:

This route is accessible only after authentication.
If the user is not authenticated, it redirects to the login page.
If the user is authenticated, it renders the "aftersignup.ejs" view, presumably a form to input additional user details.
GET /editdetails - Edit User Details:

Similar to /details, this route is accessible only after authentication.
If the user is not authenticated, it redirects to the login page.
If the user is authenticated, it retrieves the user's data and renders the "editDetails.ejs" view, allowing the user to edit their details.
POST /details - Submit User Details Form:

Handles form submission from the user details form (/details).
Extracts user details from the request body (e.g., username, age, gender, etc.).
Creates a new user document using the user model and saves it to the MongoDB database.
Redirects the user to the home page (/) after successful submission.
PATCH /editdetails/:id - Update User Details:

Handles form submission for updating user details.
Extracts the user ID from the URL parameters.
Updates the user's details in the MongoDB database based on the provided data.
Redirects the user to the home page (/) after successful update.
GET /admin - Admin Dashboard:

Requires authentication and checks if the user is an admin.
If the user is not authenticated or not an admin, it redirects to the logout page (/logout2).
If the user is authenticated as an admin, it retrieves user data from MongoDB and calculates statistics such as BMI ranges, age groups, average BMI, and total logins.
Renders the "index.ejs" view with the calculated statistics and user data.
GET /logout2 - Logout Page (Admin):

Checks if the user is authenticated.
If the user is authenticated, it renders the "editDetails.ejs" view, presumably for admin actions.
Otherwise, it likely redirects to the login page or performs a logout action.
GET /profile - User Profile:

Requires authentication and renders the user's profile page.
Retrieves user data based on the authenticated user's email.
Renders the "index.ejs" view with the user's profile data.
DELETE /admin/:id - Delete User (Admin):

Requires authentication as an admin.
Handles deletion of a user based on the user ID (:id) provided in the URL parameters.
Deletes the user document from the MongoDB database and redirects to the admin dashboard (/admin).
GET /admin/edituser/:id - Admin Edit User Page:

Requires authentication as an admin.
Retrieves user data based on the user ID (:id) provided in the URL parameters.
Renders the "adminedit.ejs" view with the user's data for editing.
PATCH /admin/edituser/:id - Update User (Admin):

Requires authentication as an admin.
Handles form submission for updating user details by the admin.
Updates the user's details in the MongoDB database based on the provided data.
Redirects to the admin dashboard (/admin) after successful update.
POST /whatsapp - Send WhatsApp Message (Admin):

Requires authentication as an admin.
Retrieves all users from the database and sends a WhatsApp message to each user using Twilio.
Redirects to the admin dashboard (/admin) after sending messages.
POST /admin/getuniquevisitors/ - Get Unique Visitors per Month (Admin):

Requires authentication as an admin.
Handles a POST request to get the unique visitors per month based on the admin's specified time.
Retrieves user data from the database and calculates the count of unique visitors per month.
Renders the "newusers.ejs" view with the calculated data.
These routes cover user authentication, CRUD operations, admin functionalities, and statistics generation based on user data in the MongoDB database. Adjustments may be needed based on your specific application requirements and data models.

Features:

User authentication using Auth0.
CRUD operations for user management.
BMI calculation for users.
Admin dashboard with statistics (BMI ranges, age groups, average BMI, total logins).
WhatsApp messaging functionality using Twilio.
