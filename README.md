# 💚 Node CRUD API

*🦥 RS-School task.*

# Getting Started 🚀
To run the project locally, you would have to download zip file with our repository or clone it to your computer. ✨

## Setup and Running ⚠️

What things do you need to do in order to run our project locally? 🤔

* Use node 20 LTS ⚡
* Installed [.git](https://git-scm.com/) on your computer. ✌️
* Code Editor of your choice. 📝
* Installed [npm](https://www.npmjs.com/). 📦

## Installation And Preparation 🔮

First make sure you have all the things listed in the previous section. Then clone our repository to your computer: 👌

```
git clone https://github.com/Quiddlee/node-crud-api.git
```

or download zip file manually with our repository.

Navigate into project folder and run 📦:

```
npm install
```

Finally run a development server: 🤩
```
npm run start:dev
```
Aaaaand you're done! 🎉🥳

## Available Scripts 🥑

Here you can find all the scripts that are available in our project. 🦚

Start the app in `base` mode: ✅

```
npm run start:dev
```

Start the app in `multi` mode: 🪭

```
npm run start:multi
```

Start the app in `prod` mode: 🪶

```
npm run start:prod
```

Lint the app with `eslint`: 🦚

```
npm run lint
```

Lint adn fix the app errors with `eslint`: 🐨

```
npm run lint:fix
```

Format the App with **Prettier**: 🧹

```
npm run format
```

Format the App with **Prettier** fix: 🍃

```
npm run format:fix
```

Type check the App with **TypeScript**: 🦁

```
npm run type-check
```

Run unit-tests with  **Vitest**: 🧪

```
npm run test
```
# Working with API 🐳

## API endpoints 🦉
The API has the following endpoints:

| Method  |    Endpoint    |                         Description |
|---------|:--------------:|------------------------------------:|
| GET	    |     /users     | Get all the users from the database |
| GET     |  	/users/:id   |            	Get a single user by ID |
| POST    |    	/users     |  	Create a new user in the database |
| PUT     |  	/users/:id   |                	Update a user by ID |
| DELETE  |  	/users/:id   |                	Delete a user by ID |

## Request body 🥑

| Endpoint |    Body    |                                                                                                                     Example |
|----------|:----------:|----------------------------------------------------------------------------------------------------------------------------:|
| POST     |   /users   |               	An object with the username age and hobbies	```{"username": "user", "age": 20, "hobbies": ["cooking", "sport"]}``` |
| PUT      | /users/:id | 	An object with the updated username age and hobbies	```{"username": "updated user", "age": 30, "hobbies": ["updated hobbie"]}``` |

## Response format 🍇

| Field   |        Type         |                                                                  Description |
|---------|:-------------------:|-----------------------------------------------------------------------------:|
| status  | "success" or "fail" |                         	Indicates whether the request was successful or not |
| message |       string        | 	in case of failed result the response will contain message why it is failed |
| data    |   Object or Array   |                                            	The data returned by the request |

## Response examples 🍋

**GET /users**

```json
 {
  "status": "success",
  "data": {
    "users": [
      {
        "username": "user",
        "age": 20,
        "hobbies": ["cooking", "sport", "programming"]
      },
      {
        "username": "user2",
        "age": 21,
        "hobbies": ["sport", "programming"]
      },
      {
        "username": "user3",
        "age": 22,
        "hobbies": ["hobbie"]
      }
    ]
  }
}
```

**GET /users/:id Error case**

```json
 {
  "status": "fail",
  "message": "😯 User not found"
}
```
