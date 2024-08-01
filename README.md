# Gunita | A Philippine Travel Guide Website

A hypothetical client contacted our small team of developers, and we were tasked to develop a travel website for their company. The client, who was a Filipino citizen, wanted the website to promote and introduce the Philippine culture not only to its locals but to its potential foreign visitors as well. The client wanted the website to be informative and valuable to its target audience, along with elements that will make it stand out from other Philippine travel websites.

As Filipino developers ourselves, we were excited and eager to complete this task. To that end, we have written this proposal to be presented to our client and asked for their approval.
Below are the outlined goals and objectives we aim to achieve by the end of this project.

Goal:
Our goal is to create an efficient website that houses the elements and requirements our client has specified and corresponds closely with our objectives below.

# Proposed Features

•	Users must be able to create an account and log in.

•	Users must be able to search for an alginic spot in the Philippines and find essential information about it.

•	Users must be able to find activities or related information related to their previous search.

•	The system must verify the user’s credentials before logging in.

•	The system must save any new user’logindentials into a database.

•	The system must learn and save the user’s previous selection or search.

•	The system must learn from the user’s search patterns and display items with tags similar to those of previous searches.

•	The system must display any related places or activities from their search to the user.

# Implemented Features (actual development)
1.	Users must be able to create an account and log in.
•	This is implemented in the create_user and login routes in main.py which handle user sign-up and login respectively.

3.	The system must be able to verify the user’s credentials before login.
•	This is implemented in the login route in main.py where user credentials are verified against the database.

4.	The system must save any new user’s credentials into a database.
•	This is implemented in the create_user route in main.py where new user credentials are saved to the database.
Screenshot evidence of implementations 1-3 (file: main.py)

5.	Users must be able to search for a specific spot in the Philippines and see essential information about it.
•	This is partially implemented. The routes GetAttByID, GetActByID, GetEventByID, and GetFoodByID in main.py retrieve specific attractions, activities, events, and food items from the database and display them.

6.	The system must learn and save the user’s previous selection or search.
•	This is implemented through saving and managing favorites, as seen in add-to-dash.js and dashboard.js.

7.	The system must learn from the user’s search patterns and display items with similar tags from the previous searches.
•	This is partially implemented through the recommendation carousel setup in carousel.js.
8.	The system must display to the user any related places or activities from their search.
•	This is implemented through the recommendation carousel and favorites functionality.

9.	The system must display to the user their saved activities, attractions, events, and food through their user dashboard.
•	This is implemented by allowing users to save items from different pages, as shown in the main.py file.

# Bugs

•	The ability for users to find activities or related information based on their previous searches.
o	The development team did not manage to make the search bar work, given their current skillset in the python language.

•	The images displayed per specific item in each category is not accurate.
o	While the development team couldn't get the images to work correctly, the titles and locations match what is displayed on each tab when clicked, as they are correctly connected to the database.
The figures below illustrate the current tabs, which correctly redirect to the corresponding pages, but with incorrect images.


# Future Amendments

In future iterations of the "Gunita" website, we plan to address the current bugs and enhance its overall functionality. Firstly, we aim to implement the feature that allows users to find activities or related information based on their previous searches. Unfortunately, the search bar functionality was not fully developed due to our current skill set in Python, but we are committed to improving our expertise and possibly integrating more advanced search algorithms to make this feature work seamlessly.

Additionally, we will aim to focus on fixing the issues with image accuracy for items in each category. While we successfully connected the titles and locations to the database, the images displayed are not accurate. Our goal is to ensure that each item displays the correct image from the database, enhancing the visual representation and user experience. 

Furthermore, we plan to optimize the website's performance and improve the UI/UX design based on user feedback. Expanding the database to include more comprehensive information about Philippine tourist spots, activities, and cultural experiences is also a priority. Finally, we will conduct thorough testing to ensure all features work seamlessly and consider integrating advanced functionalities such as interactive maps and user-generated content to make the website more engaging and informative.
