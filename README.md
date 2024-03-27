SAS Fit To Slim
Project Description
SAS Fit To Slim is a web application built using Node.js, Express.js, MongoDB, and Auth0 for user authentication. It includes features such as user registration, login, profile management, admin dashboard, and sending messages via WhatsApp using Twilio.

Routes Description
GET / - Home Page:

Checks if the user is authenticated using Auth0 (req.oidc.isAuthenticated()).
Renders the "once.ejs" view if the user is not authenticated.
Retrieves user data from MongoDB and renders the "homepage.ejs" view if the user is authenticated.
GET /details - User Details Form:

Accessible only after authentication.
Renders the "aftersignup.ejs" view for additional user details input.
GET /editdetails - Edit User Details:

Accessible after authentication.
Renders the "editDetails.ejs" view for editing user details.
POST /details - Submit User Details Form:

Handles form submission for user details.
Creates a new user document in MongoDB and redirects to the home page.
PATCH /editdetails/:id - Update User Details:

Handles form submission for updating user details.
Updates user details in MongoDB based on the provided data.
GET /admin - Admin Dashboard:

Renders the "editDetails.ejs" view for admin actions.
GET /profile - User Profile:

Renders the user's profile page with profile data.
DELETE /admin/:id - Delete User (Admin):

Handles user deletion based on user ID.
GET /admin/edituser/:id - Admin Edit User Page:

Renders the "adminedit.ejs" view for editing user data as an admin.
PATCH /admin/edituser/:id - Update User (Admin):

Handles form submission for updating user details by admin.
POST /whatsapp - Send WhatsApp Message (Admin):

Sends WhatsApp messages to all users.
POST /admin/getuniquevisitors/ - Get Unique Visitors per Month (Admin):

Calculates unique visitors per month based on admin's specified time.
Features
User authentication using Auth0.
CRUD operations for user management.
BMI calculation for users.
Admin dashboard with statistics (BMI ranges, age groups, average BMI, total logins).
WhatsApp messaging functionality using Twilio.
