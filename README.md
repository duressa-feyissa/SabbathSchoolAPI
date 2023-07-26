# About Sabbath SchoolAPI
The SabbathSchoolAPI is a powerful tool for managing Sabbath School materials. It allows users to interact with languages, quarters, and lessons through simple and intuitive API endpoints. Users can create, read, update, and delete data as needed, making it easy to organize and customize their Sabbath School experience.

### Usage
To use the SabbathSchoolAPI, you need to make HTTP requests to the specified endpoints using the appropriate methods (e.g., GET, POST, PUT, DELETE). The API will respond with JSON data that you can parse and use in your applications.

For example, to retrieve all available languages, you would send a GET request to /api/v1/languages. The API will respond with a JSON array containing language objects, each representing a different available language.

### API Endpoints

#### `Fetch Actual Data Using: https://sabbathschool.duresa.com.et/api/v1/`

#### Languages<br/>
`GET /api/v1/languages: Get all available languages.`<br/>
`POST /api/v1/languages: Create a new language.`<br/>
`GET /api/v1/languages/:lang: Get details of a specific language.`<br/>
`PUT /api/v1/languages/:lang: Update details of a specific language.`<br/>
`DELETE /api/v1/languages/:lang: Delete a language.`<br/><br/>

#### Quarters<br/>
`GET /api/v1/languages/:lang/quarters: Get all quarters.`<br/>
`POST /api/v1/languages/:lang/quarters Create a new quarter.`<br/>
`GET /api/v1/languages/:lang/quarters/:id: Get details of a specific quarter.`<br/>
`PUT api/v1/languages/:lang/quarters/:id Update details of a specific quarter.`<br/>
`DELETE api/v1/languages/:lang/quarters/:id Delete a quarter.`<br/>

#### Lesson<br/><br/>
`GET /api/v1/languages/:lang/quarters/:id/lessons: Get all lessons.`<br/>
`POST /api/v1/languages/:lang/quarters/:id/lessons: Create a new lesson.`<br/>
`GET /api/v1/languages/:lang/quarters/:id/lessons/:id: Get details of a specific lesson.`<br/>
`PUT /api/v1/languages/:lang/quarters/:id/lessons/:id: Update details of a specific lesson.`<br/>
`DELETE /api/v1/languages/:lang/quarters/:id/lessons/:id: Delete a lesson.`<br/>

#### Day<br/><br/>
`GET /api/v1/languages/:lang/quarters/:id/lessons/:id:/days: Get all days.`<br/>
`POST /api/v1/languages/:lang/quarters/:id/lessons/:id:/days: Create a new day.`<br/>
`GET /api/v1/languages/:lang/quarters/:id/lessons/:id:/days/:id: Get details of a specific day.`<br/>
`PUT /api/v1/languages/:lang/quarters/:id/lessons/:id:/days/:id: Update details of a specific day.`<br/>
`DELETE /api/v1/languages/:lang/quarters/:id/lessons/:id:/days/:id: Delete a day.`<br/>

### Getting Started
To get started with the SabbathSchoolAPI, follow these steps:

Install Node.js and MongoDB on your machine if you haven't already.
Clone this repository to your local machine.
Navigate to the project directory and run npm install to install the required dependencies.
Configure the MongoDB connection in config.js to point to your MongoDB server.
Run the API server by executing npm start in the project directory.
You can now start making API requests using your preferred HTTP client (e.g., Postman, cURL, Axios).

### Contribution
We welcome contributions to the SabbathSchoolAPI project. If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

Happy coding!
